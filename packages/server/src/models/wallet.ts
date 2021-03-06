import mysql, { RowDataPacket } from "mysql2";
import { EXPONENT } from "../constants";
import { AirdropResponse, History, RequestStatus, RequestType, ServerResponse } from "../types";
import { calculateLpTokenShare, getPrice } from "./pool";

export async function upsertBalance(connection: mysql.Connection, uid: string, ccy: string, amount: bigint) {
  await connection.promise().execute(
    `
    INSERT INTO balances (uid, ccy_id, amount)
    VALUES (?, (SELECT c.id FROM currencies c WHERE c.symbol = ?), ?) as new
    ON DUPLICATE KEY UPDATE balances.amount = balances.amount + new.amount, updated_at = NOW();
  `,
    [uid, ccy, amount],
  );
}

export async function getCoinBalances(
  connection: mysql.Connection,
  uid: string,
): Promise<{ name: string; symbol: string; amount: string }[]> {
  const [rows] = await connection
    .promise()
    .query<RowDataPacket[][] & { name: string; symbol: string; amount: string }[]>(
      `
      SELECT c.name, c.symbol, b.amount
      FROM balances b
      JOIN currencies c ON b.ccy_id = c.id
      WHERE b.uid = ?
      AND c.lp_pair_id IS NULL;
    `,
      [uid],
    );

  return rows;
}

export async function getLpBalances(
  connection: mysql.Connection,
  uid: string,
): Promise<
  {
    name: string;
    symbol: string;
    amount: string;
    ccy1Name: string;
    ccy1Symbol: string;
    ccy2Name: string;
    ccy2Symbol: string;
  }[]
> {
  const [rows] = await connection.promise().query<
    RowDataPacket[][] &
      {
        name: string;
        symbol: string;
        amount: string;
        ccy1Name: string;
        ccy1Symbol: string;
        ccy2Name: string;
        ccy2Symbol: string;
      }[]
  >(
    `
      SELECT c.name, c.symbol, b.amount, c1.name as ccy1Name, c1.symbol as ccy1Symbol, c2.name as ccy2Name, c2.symbol as ccy2Symbol
      FROM balances b
      JOIN currencies c ON b.ccy_id = c.id
      JOIN pairs p ON c.lp_pair_id = p.id
      JOIN currencies c1 ON p.ccy1_id = c1.id
      JOIN currencies c2 ON p.ccy2_id = c2.id
      WHERE b.uid = ?
      AND c.lp_pair_id IS NOT NULL;
      `,
    [uid],
  );
  return rows;
}

export async function getLpCoinValues(
  connection: mysql.Connection,
  uid: string,
): Promise<{ name: string; symbol: string; amount: string }[]> {
  try {
    await connection.promise().beginTransaction();

    const lpBalances = await getLpBalances(connection, uid);

    const coinBalances: Map<
      string,
      {
        name: string;
        symbol: string;
        amount: string;
      }
    > = (
      await Promise.all(
        lpBalances.map(async (lpBalance) => {
          const { reserve1, reserve2 } = await calculateLpTokenShare(
            connection,
            lpBalance.symbol,
            BigInt(lpBalance.amount),
          );

          return {
            ccy1Name: lpBalance.ccy1Name,
            ccy1Symbol: lpBalance.ccy1Symbol,
            ccy1Amount: reserve1.toString(),
            ccy2Name: lpBalance.ccy2Name,
            ccy2Symbol: lpBalance.ccy2Symbol,
            ccy2Amount: reserve2.toString(),
          };
        }),
      )
    ).reduce((acc, cur) => {
      const _prev1 = acc.get(cur.ccy1Symbol) ?? {
        name: cur.ccy1Name,
        symbol: cur.ccy1Symbol,
        amount: "0",
      };
      const _prev2 = acc.get(cur.ccy2Symbol) ?? {
        name: cur.ccy2Name,
        symbol: cur.ccy2Symbol,
        amount: "0",
      };

      acc.set(cur.ccy1Symbol, {
        ..._prev1,
        amount: (BigInt(_prev1.amount) + BigInt(cur.ccy1Amount)).toString(),
      });
      acc.set(cur.ccy2Symbol, {
        ..._prev2,
        amount: (BigInt(_prev2.amount) + BigInt(cur.ccy2Amount)).toString(),
      });

      return acc;
    }, new Map<string, { name: string; symbol: string; amount: string }>());

    await connection.promise().commit();

    return Array.from(coinBalances.values());
  } catch (err: any) {
    console.error(err);
    await connection.promise().rollback();
    throw err;
  }
}

export async function getTransactionHistory(connection: mysql.Connection, uid: string): Promise<History[]> {
  const [rows] = await connection.promise().query<RowDataPacket[][] & History[]>(
    `
      SELECT t.updated_at as date, c1.symbol as base, c2.symbol as quote, t.amount as amt, t.price as price
      FROM transactions t
      JOIN pairs p ON t.pair_id = p.id
      JOIN currencies c1 ON p.ccy1_id = c1.id
      JOIN currencies c2 ON p.ccy2_id = c2.id
      WHERE t.uid = ?
      ORDER BY t.updated_at DESC LIMIT 100;
    `,
    [uid],
  );

  return rows;
}

export async function upsertRequest(
  connection: mysql.Connection,
  uid: string,
  requestType: RequestType,
  requestStatus: RequestStatus,
  ccy: string,
  amount: string,
  address: string,
) {
  await connection.promise().execute(
    `
    INSERT INTO requests (uid, request_type, request_status, ccy_id, amount, address)
    VALUES (?, ?, ?, (SELECT c.id FROM currencies c WHERE c.symbol = ?), ?, ?)
    ON DUPLICATE KEY UPDATE request_status = ?, updated_at = NOW();
  `,
    [uid, requestType, requestStatus, ccy, amount, address, requestStatus],
  );
}

export async function getAirdropStatus(connection: mysql.Connection, uid: string, airdropId: string): Promise<boolean> {
  const [res] = await connection.promise().execute<RowDataPacket[][]>(
    `
    SELECT * FROM airdrops
    WHERE uid = ?
    AND airdrop_id = ?
  `,
    [uid, airdropId],
  );

  if (res.length === 0) {
    return false;
  }

  return true;
}

export async function claimAirdrop(
  connection: mysql.Connection,
  uid: string,
  airdropId: string,
): Promise<ServerResponse<AirdropResponse>> {
  try {
    await connection.promise().beginTransaction();

    const [res] = await connection.promise().execute<RowDataPacket[][]>(
      `
      SELECT * FROM airdrops
      WHERE uid = ?
      AND airdrop_id = ?
    `,
      [uid, airdropId],
    );

    if (res.length !== 0) {
      // airdrop already claimed
      await connection.promise().rollback();
      return {
        error: {
          type: "INVALID_ARGUMENTS",
          message: "Airdrop already claimed",
        },
      };
    }

    await connection.promise().execute(
      `
      INSERT INTO airdrops (uid, airdrop_id)
      VALUES (?, ?);
    `,
      [uid, airdropId],
    );

    // Insert balances
    await upsertBalance(connection, uid, "BTC", 1n * EXPONENT);
    await upsertBalance(connection, uid, "ETH", 10n * EXPONENT);
    await upsertBalance(connection, uid, "SOL", 100n * EXPONENT);
    await upsertBalance(connection, uid, "SGD", 1000000n * EXPONENT);

    await connection.promise().commit();

    return {
      data: {
        id: airdropId,
      },
    };
  } catch (err) {
    console.error(err);
    await connection.promise().rollback();
    throw err;
  }
}
