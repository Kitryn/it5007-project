import BigNumber from "bignumber.js";
import mysql, { RowDataPacket } from "mysql2";
import { getAmountOut, getRatio } from "../amm";
import { EXPONENT } from "../constants";

export async function createPair(connection: mysql.Connection, ccy1: string, ccy2: string) {
  const name = `${ccy1}_${ccy2}`;
  const symbol = `LP_${ccy1}_${ccy2}`;

  try {
    await connection.promise().beginTransaction();

    await connection.promise().execute(
      `
      INSERT INTO pairs (ccy1_id, ccy2_id)
      VALUES ((SELECT c.id FROM currencies c WHERE c.symbol = ?), (SELECT c.id FROM currencies c WHERE c.symbol = ?))
      ON DUPLICATE KEY UPDATE id=id;
      `,
      [ccy1, ccy2],
    );

    await connection.promise().execute(
      `
      INSERT INTO currencies (name, symbol, lp_pair_id)
      VALUES (?, ?, (SELECT p.id FROM pairs p WHERE p.ccy1_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?) AND p.ccy2_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?)))
      ON DUPLICATE KEY UPDATE id=id;
      `,
      [name, symbol, ccy1, ccy2],
    );

    await connection.promise().execute(
      `
      INSERT INTO reserves (pair_id, ccy_id, reserve)
      VALUES 
      (
        (SELECT p.id FROM pairs p WHERE p.ccy1_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?) AND p.ccy2_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?)),
        (SELECT c.id FROM currencies c WHERE c.symbol = ?),
        0
      ),
      (
        (SELECT p.id FROM pairs p WHERE p.ccy1_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?) AND p.ccy2_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?)),
        (SELECT c.id FROM currencies c WHERE c.symbol = ?),
        0
      )
      ON DUPLICATE KEY UPDATE id=id;
      `,
      [ccy1, ccy2, ccy1, ccy1, ccy2, ccy2],
    );

    await connection.promise().commit();
  } catch (err: any) {
    console.error(err);
    await connection.promise().rollback();
    throw err;
  }
}

export async function addLiquidity(
  connection: mysql.Connection,
  uid: string,
  ccy1: string,
  ccy2: string,
  amount1: bigint,
  amount2: bigint,
) {
  try {
    await connection.promise().beginTransaction();

    const lpSymbol = `LP_${ccy1}_${ccy2}`;

    // Get reserves
    const [reserves] = await connection.promise().execute<RowDataPacket[][] & { reserve1: string; reserve2: string }[]>(
      `
        SELECT r1.reserve as reserve1, r2.reserve as reserve2
        FROM reserves r1
        JOIN reserves r2 ON r1.pair_id = r2.pair_id
        WHERE r1.ccy_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?) AND r2.ccy_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?)
      `,
      [ccy1, ccy2],
    );

    const { reserve1, reserve2 } = reserves[0];

    let liquidity: BigNumber;

    if (reserve1 == "0" || reserve2 == "0") {
      liquidity = new BigNumber(amount1.toString())
        .multipliedBy(new BigNumber(amount2.toString()))
        .squareRoot()
        .integerValue();
    } else {
      const total: BigNumber = new BigNumber(reserve1).plus(new BigNumber(reserve2));
      liquidity = BigNumber.min(
        new BigNumber(amount1.toString()).multipliedBy(total).dividedBy(reserve1).integerValue(),
        new BigNumber(amount2.toString()).multipliedBy(total).dividedBy(reserve2).integerValue(),
      );
    }

    // Deduct amounts from user balance
    await connection.promise().execute(
      `
      UPDATE balances 
      SET 
        amount = (CASE WHEN ccy_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?) THEN amount - ?
                        WHEN ccy_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?) THEN amount - ?
                        ELSE amount END),
        updated_at = NOW()
      WHERE uid = ? AND ccy_id in ((SELECT c.id FROM currencies c WHERE c.symbol = ?), (SELECT c.id FROM currencies c WHERE c.symbol = ?))
      `,
      [ccy1, amount1, ccy2, amount2, uid, ccy1, ccy2],
    );

    // Mint liquidity tokens to uid
    await connection.promise().execute(
      `
      INSERT INTO balances (uid, ccy_id, amount)
      VALUES (?, (SELECT c.id FROM currencies c WHERE c.symbol = ?), ?)
      ON DUPLICATE KEY UPDATE amount = amount + ?, updated_at = NOW();
    `,
      [uid, lpSymbol, liquidity.toString(), liquidity.toString()],
    );

    // Add to reserves
    await connection.promise().execute(
      `
      UPDATE reserves
      SET reserve = (CASE WHEN ccy_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?) THEN reserve + ?
                        WHEN ccy_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?) THEN reserve + ?
                        ELSE reserve END),
          updated_at = NOW()
      WHERE pair_id = (SELECT p.id FROM pairs p WHERE p.ccy1_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?) AND p.ccy2_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?))
      `,
      [ccy1, amount1, ccy2, amount2, ccy1, ccy2],
    );

    await connection.promise().commit();
  } catch (err: any) {
    console.error(err);
    await connection.promise().rollback();
    throw err;
  }
}

export async function calculateLpTokenShare(
  connection: mysql.Connection,
  lpSymbol: string,
  amount: bigint,
): Promise<{ ccy1: string; ccy2: string; reserve1: number | string; reserve2: number | string }> {
  const [_, ccy1, ccy2] = lpSymbol.split("_");

  const [rows] = await connection
    .promise()
    .query<RowDataPacket[][] & { ccy1: string; ccy2: string; reserve1: number | string; reserve2: number | string }[]>(
      `
    SELECT c1.symbol as ccy1, c2.symbol as ccy2, r.reserve1 * l.ratio as reserve1, r.reserve2 * l.ratio as reserve2
    FROM
      (SELECT p.id as pair_id, r1.ccy_id as ccy1_id, r1.reserve as reserve1, r2.ccy_id as ccy2_id, r2.reserve as reserve2
        FROM pairs p
        JOIN reserves r1 ON p.ccy1_id = r1.ccy_id AND p.id = r1.pair_id
        JOIN reserves r2 ON p.ccy2_id = r2.ccy_id AND p.id = r2.pair_id
        WHERE p.ccy1_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?) AND p.ccy2_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?)) r
    JOIN currencies c1 ON r.ccy1_id = c1.id
    JOIN currencies c2 ON r.ccy2_id = c2.id
    JOIN 
      (SELECT ? / SUM(b.amount) as ratio
        FROM balances b
        JOIN currencies c ON b.ccy_id = c.id
        WHERE c.lp_pair_id = (SELECT id FROM pairs p WHERE p.ccy1_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?) AND p.ccy2_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?))) l
    ON 1 = 1
    `,
      [ccy1, ccy2, amount.toString(), ccy1, ccy2],
    );

  return rows[0];
}

export async function removeLiquidity(connection: mysql.Connection, uid: string, lpSymbol: string, amount: bigint) {
  const [_, ccy1, ccy2] = lpSymbol.split("_");

  try {
    await connection.promise().beginTransaction();

    // Calculate share of liquidity pool
    const { reserve1, reserve2 } = await calculateLpTokenShare(connection, lpSymbol, amount);

    // Deduct liquidity tokens from user balance
    await connection.promise().execute(
      `
      UPDATE balances SET amount = amount - ?, updated_at = NOW() WHERE uid = ? AND ccy_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?)
      `,
      [amount.toString(), uid, lpSymbol],
    );

    // Deduct share of reserves from liquidity pool
    await connection.promise().execute(
      `
      UPDATE reserves
      SET reserve = (CASE WHEN ccy_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?) THEN reserve - ?
                        WHEN ccy_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?) THEN reserve - ?
                        ELSE reserve END),
          updated_at = NOW()
      WHERE pair_id = (SELECT p.id FROM pairs p WHERE p.ccy1_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?) AND p.ccy2_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?))
      `,
      [ccy1, reserve1, ccy2, reserve2, ccy1, ccy2],
    );

    // Add share of reserves to user balance
    await connection.promise().execute(
      `
      INSERT INTO balances (uid, ccy_id, amount)
      VALUES (?, (SELECT c.id FROM currencies c WHERE c.symbol = ?), ?),
              (?, (SELECT c.id FROM currencies c WHERE c.symbol = ?), ?) AS new
      ON DUPLICATE KEY UPDATE amount = amount + new.amount, updated_at = NOW();
    `,
      [uid, ccy1, reserve1, uid, ccy2, reserve2],
    );

    await connection.promise().commit();
  } catch (err: any) {
    console.error(err);
    await connection.promise().rollback();
    throw err;
  }
}

export async function getPrice(connection: mysql.Connection, ccy1: string): Promise<number> {
  // lets always use SGD as base currency
  // hacky hack hack
  if (ccy1 === "SGD") return 1.0;

  const [rows] = await connection.promise().query<{ reserve1: string; reserve2: string }[] & RowDataPacket[][]>(
    `
      SELECT r1.reserve as reserve1, r2.reserve as reserve2 
      FROM pairs p
      JOIN reserves r1 ON p.id = r1.pair_id AND r1.ccy_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?)
      JOIN reserves r2 ON p.id = r2.pair_id AND r2.ccy_id = (SELECT c.id FROM currencies c WHERE c.symbol = 'SGD')
      WHERE p.ccy1_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?)
      AND p.ccy2_id = (SELECT c.id FROM currencies c WHERE c.symbol = 'SGD');
  `,
    [ccy1, ccy1],
  );

  return getRatio(BigInt(rows[0].reserve1), BigInt(rows[0].reserve2));
}

export async function getPrices(
  connection: mysql.Connection,
  ccys: string[],
): Promise<{ ccy: string; price: number }[]> {
  if (ccys == null || ccys.length === 0) return [];
  const prices = await Promise.all(ccys.map((ccy) => getPrice(connection, ccy)));

  return prices.map((price, i) => ({ ccy: ccys[i], price }));
}

export async function getQuote(
  connection: mysql.Connection,
  ccy1: string,
  ccy2: string,
  amount: bigint,
  buy: boolean,
): Promise<{
  idealPrice: number;
  actualPrice: number;
  slippage: number;
  idealOutAmount: string;
  actualOutAmount: string;
}> {
  const [rows] = await connection.promise().query<{ reserve1: string; reserve2: string }[] & RowDataPacket[][]>(
    `
    SELECT r1.reserve as reserve1, r2.reserve as reserve2 
    FROM pairs p
    JOIN reserves r1 ON p.id = r1.pair_id AND r1.ccy_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?)
    JOIN reserves r2 ON p.id = r2.pair_id AND r2.ccy_id = (SELECT c.id FROM currencies c WHERE c.symbol = 'SGD')
    WHERE p.ccy1_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?)
    AND p.ccy2_id = (SELECT c.id FROM currencies c WHERE c.symbol = 'SGD');
  `,
    [ccy1, ccy2],
  );

  const { reserve1: _reserve1, reserve2: _reserve2 } = rows[0];
  const [reserve1, reserve2] = [BigInt(_reserve1), BigInt(_reserve2)];

  let idealPrice: number = getRatio(reserve1, reserve2);
  let out: bigint;
  if (buy) {
    // get reserve1 out
    out = getAmountOut(amount, reserve2, reserve1);
  } else {
    // get reserve2 out
    out = getAmountOut(amount, reserve1, reserve2);
  }

  console.log(out);
  let actualPrice = getRatio(out, amount);

  const idealOutAmount = new BigNumber(buy ? 1 / idealPrice : idealPrice)
    .multipliedBy(new BigNumber(amount.toString()))
    .integerValue();

  const actualOutAmount = new BigNumber(out.toString());

  const slippage = actualOutAmount.dividedBy(idealOutAmount).toNumber();

  return {
    idealPrice,
    actualPrice,
    slippage,
    idealOutAmount: idealOutAmount.toString(),
    actualOutAmount: actualOutAmount.toString(),
  };
}

export async function swap(
  connection: mysql.Connection,
  uid: string,
  ccy1: string,
  ccy2: string,
  amt: string,
  buy: boolean,
) {
  try {
    const amount: bigint = BigInt(amt);
    await connection.promise().beginTransaction();

    // Get reserves
    const [rows] = await connection.promise().query<{ reserve1: string; reserve2: string }[] & RowDataPacket[][]>(
      `
      SELECT r1.reserve as reserve1, r2.reserve as reserve2 
      FROM pairs p
      JOIN reserves r1 ON p.id = r1.pair_id AND r1.ccy_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?)
      JOIN reserves r2 ON p.id = r2.pair_id AND r2.ccy_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?)
      WHERE p.ccy1_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?)
      AND p.ccy2_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?);
    `,
      [ccy1, ccy2, ccy1, ccy2],
    );

    const { reserve1: _reserve1, reserve2: _reserve2 } = rows[0];
    const [reserve1, reserve2] = [BigInt(_reserve1), BigInt(_reserve2)];
    console.log(`Pair: ${ccy1}/${ccy2}, reserves: ${reserve1}/${reserve2}`);

    // Get amount out
    let out: bigint;
    if (buy) {
      // get reserve1 out
      out = getAmountOut(amount, reserve1, reserve2);
    } else {
      // get reserve2 out
      out = getAmountOut(amount, reserve2, reserve1);
    }

    // Subtract and add user balances
    let _params: string[];
    if (buy) {
      console.log(`${uid} Buying ${amount} ${ccy1}, spending ${out} ${ccy2}`);
      _params = [ccy1, amount.toString(), ccy2, out.toString(), uid, ccy1, ccy2];
    } else {
      console.log(`${uid} Selling ${amount} ${ccy1}, getting ${out} ${ccy2}`);
      _params = [ccy2, out.toString(), ccy1, amount.toString(), uid, ccy1, ccy2];
    }
    console.log(
      `Normalised: ${new BigNumber(amount.toString()).dividedBy(EXPONENT.toString())} ${ccy1}, ${new BigNumber(
        out.toString(),
      ).dividedBy(EXPONENT.toString())} ${ccy2}`,
    );
    await connection.promise().query(
      `
      UPDATE balances 
      SET 
        amount = (CASE WHEN ccy_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?) THEN amount + ?
                        WHEN ccy_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?) THEN amount - ?
                        ELSE amount END),
        updated_at = NOW()
      WHERE uid = ? AND ccy_id in ((SELECT c.id FROM currencies c WHERE c.symbol = ?), (SELECT c.id FROM currencies c WHERE c.symbol = ?));
    `,
      _params,
    );

    console.log(_params);
    // Subtract and add reserve balances
    await connection.promise().query(
      `
      UPDATE reserves
      SET
        reserve = (CASE WHEN ccy_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?) THEN reserve - ?
                        WHEN ccy_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?) THEN reserve + ?
                        ELSE reserve END),
        updated_at = NOW()
      WHERE pair_id = (SELECT p.id FROM pairs p WHERE p.ccy1_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?) AND p.ccy2_id = (SELECT c.id FROM currencies c WHERE c.symbol = ?));
      `,
      [..._params.slice(0, 4), ccy1, ccy2],
    );

    await connection.promise().commit();
  } catch (err: any) {
    console.error(err);
    await connection.promise().rollback();
    throw err;
  }
}
