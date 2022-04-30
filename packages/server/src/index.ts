import path from "path";
import dotenv from "dotenv";
dotenv.config({
  path: path.join(__dirname, "../../../.env"),
});

import express from "express";
import { Request, Response } from "express";
import { applicationDefault, initializeApp } from "firebase-admin/app";
import mysql from "mysql2";

import { isAdminMiddleware, isLoggedInMiddleware } from "./auth";
import { createCurrencies, createTables } from "./models/initialiseDb";
import {
  getCoinBalances,
  getLpBalances,
  getLpCoinValues,
  getTransactionHistory,
  upsertBalance,
  upsertRequest,
} from "./models/wallet";
import {
  CoinBalance,
  QuoteResponse,
  RequestStatus,
  RequestType,
  ResponseError,
  ServerResponse,
  SwapResponse,
  Wallet,
} from "./types";
import { EXPONENT } from "./constants";
import BigNumber from "bignumber.js";
import {
  addLiquidity,
  calculateLpTokenShare,
  createPair,
  getBuyQuote,
  getPrices,
  getSellQuote,
  listPairs,
  removeLiquidity,
  swap,
} from "./models/pool";

const PORT = process.env.PORT ?? 3000;
const app = express();
const HOT_WALLET = "0x0d7b26Bfa1D36e648513a80c8D6172583E7a2c5E";
const EXCHANGE_ONLY_UID = "exchange-only";

if (process.env.NODE_ENV !== "production") {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(
    __dirname,
    "../../..",
    process.env.GOOGLE_APPLICATION_CREDENTIALS ?? "serviceAccountKey.json",
  );
}

initializeApp({
  credential: applicationDefault(),
});

// Create the MySQL connection to Google Cloud SQL
const isWin = process.platform === "win32";
const dbSocketPath = process.env.DB_SOCKET_PATH || "/cloudsql";
const mySqlConfigs = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  supportBigNumbers: true,
  bigNumberStrings: true,
  ...(isWin ? {} : { socketPath: `${dbSocketPath}/${process.env.INSTANCE_CONNECTION_NAME}` }),
  ...(isWin ? { host: "127.0.0.1", port: 3306 } : {}),
};
const connection = mysql.createConnection(mySqlConfigs);

/**
 * Middleware
 */
app.use(express.json());

/**
 * Debug endpoints
 */
app.get("/api/debug/initialise", [isLoggedInMiddleware, isAdminMiddleware], async (req: Request, res: Response) => {
  try {
    const uid = req.decodedToken!.uid;

    await createTables(connection);
    await createCurrencies(connection);

    await upsertBalance(connection, uid, "BTC", 2n * EXPONENT);
    await upsertBalance(connection, uid, "ETH", 10n * EXPONENT);
    await upsertBalance(connection, uid, "SOL", 10n * EXPONENT);
    await upsertBalance(connection, uid, "SGD", 10000000n * EXPONENT);

    await createPair(connection, "BTC", "SGD");
    await createPair(connection, "ETH", "SGD");
    await createPair(connection, "SOL", "SGD");

    await addLiquidity(connection, EXCHANGE_ONLY_UID, "BTC", "SGD", 1000n * EXPONENT, 53018000n * EXPONENT);
    await addLiquidity(connection, EXCHANGE_ONLY_UID, "ETH", "SGD", 10000n * EXPONENT, 38647600n * EXPONENT);
    await addLiquidity(connection, EXCHANGE_ONLY_UID, "SOL", "SGD", 270270n * EXPONENT, 35000000n * EXPONENT);

    res.send("OK");
  } catch (err: any) {
    console.error(err);
    res.status(500).send(err.toString());
  }
});

app.get("/api/debug/funds", [isLoggedInMiddleware, isAdminMiddleware], async (req: Request, res: Response) => {
  try {
    const uid = req.decodedToken!.uid;

    await upsertBalance(connection, uid, "BTC", 2n * EXPONENT);
    await upsertBalance(connection, uid, "ETH", 10n * EXPONENT);
    await upsertBalance(connection, uid, "SOL", 10n * EXPONENT);
    await upsertBalance(connection, uid, "SGD", 10000000n * EXPONENT);

    await addLiquidity(connection, uid, "BTC", "SGD", 1n * EXPONENT, 100000n * EXPONENT);
    await addLiquidity(connection, uid, "ETH", "SGD", 2n * EXPONENT, 1000n * EXPONENT);
    await addLiquidity(connection, uid, "SOL", "SGD", 3n * EXPONENT, 1000n * EXPONENT);
    res.send("OK");
  } catch (err: any) {
    console.error(err);
    res.status(500).send(err.toString());
  }
});

/**
 * Get the balance of a user
 */
app.get("/api/wallet", [isLoggedInMiddleware], async (req: Request, res: Response) => {
  try {
    const uid = req.decodedToken!.uid;

    const coinBalances = await getCoinBalances(connection, uid);
    const lpValues = await getLpCoinValues(connection, uid);

    const balMap: Map<string, CoinBalance> = new Map<string, CoinBalance>();

    for (const coinBalance of coinBalances) {
      const _prev = balMap.get(coinBalance.symbol) ?? {
        name: coinBalance.name,
        symbol: coinBalance.symbol,
        price: 0,
        qty: "0",
        value: "0",
        earning: "0",
        earningValue: "0",
      };

      balMap.set(coinBalance.symbol, {
        ..._prev,
        qty: (BigInt(_prev.qty) + BigInt(coinBalance.amount)).toString(),
      });
    }

    for (const lpValue of lpValues) {
      const _prev = balMap.get(lpValue.symbol) ?? {
        name: lpValue.name,
        symbol: lpValue.symbol,
        price: 0,
        qty: "0",
        value: "0",
        earning: "0",
        earningValue: "0",
      };

      balMap.set(lpValue.symbol, {
        ..._prev,
        earning: (BigInt(_prev.earning) + BigInt(lpValue.amount)).toString(),
      });
    }

    const allSymbols = Array.from(balMap.keys());
    const symbolPrices: Map<string, number> = (await getPrices(connection, allSymbols)).reduce((acc, curr) => {
      acc.set(curr.ccy, curr.price);
      return acc;
    }, new Map<string, number>());

    allSymbols.forEach((symbol) => {
      const coinBalance = balMap.get(symbol)!;
      const price = symbolPrices.get(symbol)!;
      balMap.set(symbol, {
        ...coinBalance,
        price,
        qty: new BigNumber(coinBalance.qty).dividedBy(EXPONENT.toString()).toString(),
        earning: new BigNumber(coinBalance.earning).dividedBy(EXPONENT.toString()).toString(),
        value: new BigNumber(coinBalance.qty).multipliedBy(price).dividedBy(EXPONENT.toString()).toString(),
        earningValue: new BigNumber(coinBalance.earning).multipliedBy(price).dividedBy(EXPONENT.toString()).toString(),
      });
    });

    const totalPortfolioValue: number = Array.from(balMap.values()).reduce((acc, curr) => {
      return acc + parseFloat(curr.value);
    }, 0);

    const totalFiatValue: number = Array.from(balMap.values())
      .filter((v) => v.symbol === "SGD")
      .reduce((acc, curr) => {
        return acc + parseFloat(curr.value);
      }, 0);

    const totalEarning: number = Array.from(balMap.values()).reduce((acc, curr) => {
      return acc + parseFloat(curr.earningValue);
    }, 0);

    const wallet: Wallet = {
      fiat: totalFiatValue.toString(),
      crypto: (totalPortfolioValue - totalFiatValue).toString(),
      coin_qty: Array.from(balMap.values()),
      earning: totalEarning.toString(),
    };

    res.send(wallet);
  } catch (err: any) {
    console.error(err);
    res.status(500).send(err.toString());
  }
});

/**
 * Get the amount currently staked in which pools
 */
app.get("/api/getStaked", [isLoggedInMiddleware], async (req: Request, res: Response) => {
  try {
    const uid = req.decodedToken!.uid;

    let staked = (await getLpBalances(connection, uid)).map((v) => {
      return {
        ...v,
        amount: new BigNumber(v.amount).dividedBy(EXPONENT.toString()).toString(),
      };
    });

    res.send(staked);
  } catch (err: any) {
    console.error(err);
    res.status(500).send(err.toString());
  }
});

/**
 * Calculate the value of liquidity tokens
 * LP symbol should be passed in query string
 */
app.get("/api/getLiquidityValue", [isLoggedInMiddleware], async (req: Request, res: Response) => {
  try {
    const uid = req.decodedToken!.uid;

    const { ccy } = req.query;
    if (ccy == null) {
      return res.status(400).send("Ccy is required");
    }

    const lpBalance = (await getLpBalances(connection, uid)).filter((v) => v.symbol === ccy).map((v) => v.amount)[0];
    if (lpBalance == null) {
      return res.status(400).send("No liquidity token found");
    }

    const lpValue = await calculateLpTokenShare(connection, ccy.toString(), BigInt(lpBalance));

    const prices = (await getPrices(connection, [lpValue.ccy1, lpValue.ccy2])).reduce((acc, curr) => {
      acc.set(curr.ccy, curr.price);
      return acc;
    }, new Map<string, number>());

    const response = {
      base: lpValue.ccy1,
      quote: lpValue.ccy2,
      baseAmount: new BigNumber(lpValue.reserve1).dividedBy(EXPONENT.toString()).toString(),
      quoteAmount: new BigNumber(lpValue.reserve2).dividedBy(EXPONENT.toString()).toString(),
      baseValue: new BigNumber(lpValue.reserve1)
        .multipliedBy(prices.get(lpValue.ccy1)!)
        .dividedBy(EXPONENT.toString())
        .toString(),
      quoteValue: new BigNumber(lpValue.reserve2)
        .multipliedBy(prices.get(lpValue.ccy2)!)
        .dividedBy(EXPONENT.toString())
        .toString(),
    };

    res.send(response);
  } catch (err: any) {
    console.error(err);
    res.status(500).send(err.toString());
  }
});

/**
 * Get price of one or more ccys
 */
app.post("/api/prices", [isLoggedInMiddleware], async (req: Request, res: Response) => {
  try {
    const ccys = req.body.ccys;
    const prices = await getPrices(connection, ccys);
    res.send(prices);
  } catch (err: any) {
    console.error(err);
    res.status(500).send(err.toString());
  }
});

/**
 * Perform a swap for a user
 * Relies on database constraints to throw an error if the user doesn't have enough balance
 */
app.post("/api/swap", [isLoggedInMiddleware], async (req: Request, res: Response<ServerResponse<SwapResponse>>) => {
  try {
    const uid = req.decodedToken!.uid;
    const { base, quote, amount, isBuy }: { base: string; quote: string; amount: number; isBuy: boolean } = req.body;

    let error: ResponseError;
    if (base == null || quote == null || amount == null || isBuy == null) {
      error = { type: "INVALID_ARGUMENTS" };
      return res.status(400).send({ error });
    }

    const amt = new BigNumber(amount).multipliedBy(EXPONENT.toString());

    if (!amt.isInteger()) {
      error = { type: "INVALID_ARGUMENTS", message: "Amount too many decimal places" };
      return res.status(400).send({ error });
    }

    if (amt.isZero() || amt.isNegative() || amt.isNaN() || !amt.isFinite()) {
      error = { type: "INVALID_ARGUMENTS", message: "Amount must be a positive number" };
      return res.status(400).send({ error });
    }

    const _res = await swap(connection, uid, base, quote, amt.integerValue().toString(), isBuy);
    if (_res.error != null) {
      return res.status(403).send(_res);
    }
    res.send(_res);
  } catch (err: any) {
    console.error(err);
    res.status(500).send(err.toString()); // don't send err message in real app
  }
});

/**
 * GET endpoint for transaction history
 */
app.get("/api/history", [isLoggedInMiddleware], async (req: Request, res: Response) => {
  try {
    const uid = req.decodedToken!.uid;

    const history = await getTransactionHistory(connection, uid);
    res.send(history);
  } catch (err: any) {
    console.error(err);
    res.status(500).send(err.toString());
  }
});

/**
 * POST request for submitting withdraw requests
 */
app.post("/api/withdraw", [isLoggedInMiddleware], async (req: Request, res: Response) => {
  try {
    const uid = req.decodedToken!.uid;

    const { ccy, amount, address }: { ccy: string; amount: number; address: string } = req.body;

    // in a real app we should have a validator middleware or library to check ccy, amount, etc
    await upsertRequest(
      connection,
      uid,
      RequestType.WITHDRAW,
      RequestStatus.PENDING,
      ccy,
      new BigNumber(amount).multipliedBy(EXPONENT.toString()).toString(),
      address,
    );
    res.send("OK");
  } catch (err: any) {
    console.error(err);
    res.status(400).send(err.toString());
  }
});

/**
 * GET request for getting deposit addresses
 * This in prod should generate a new address for every user, stubbed for now
 * The ccy should be passed in the query string
 */
app.get("/api/deposit", [isLoggedInMiddleware], async (req: Request, res: Response) => {
  try {
    const uid = req.decodedToken!.uid;
    const ccy = req.query.ccy;

    if (ccy == null) {
      return res.status(400).send("Missing ccy");
    }

    res.send({
      ccy,
      address: HOT_WALLET,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).send(err.toString());
  }
});

/**
 * POST request for DEPOSITING liquidity
 * Body needs to include base, quote, amountBase, amountQuote
 */
app.post("/api/stake", [isLoggedInMiddleware], async (req: Request, res: Response) => {
  try {
    const uid = req.decodedToken!.uid;
    const {
      base,
      quote,
      amountBase,
      amountQuote,
    }: { base: string; quote: string; amountBase: number; amountQuote: number } = req.body;

    // in a real app we need to do proper verification
    if (amountBase <= 0 || amountQuote <= 0) {
      return res.status(400).send("Invalid amount");
    }

    if (base === quote) {
      return res.status(400).send("Base and quote cannot be the same");
    }

    if (quote !== "SGD") {
      return res.status(400).send("Quote must be SGD");
    }

    const amtBase = BigInt(new BigNumber(amountBase).multipliedBy(EXPONENT.toString()).integerValue().toString());
    const amtQuote = BigInt(new BigNumber(amountQuote).multipliedBy(EXPONENT.toString()).integerValue().toString());

    await addLiquidity(connection, uid, base, quote, amtBase, amtQuote);
    res.send("OK");
  } catch (err: any) {
    console.error(err);
    res.status(500).send(err.toString());
  }
});

/**
 * POST request for REMOVING liquidity
 * Body needs to include LP symbol (LP_BTC_SGD), and amount of LP tokens to burn
 * Pass amount: 0 to remove all liquidity
 */
app.post("/api/unstake", [isLoggedInMiddleware], async (req: Request, res: Response) => {
  try {
    const uid = req.decodedToken!.uid;
    const { ccy, amount }: { ccy: string; amount: number } = req.body;

    if (ccy == null || amount == null || amount < 0) {
      return res.status(400).send("Invalid body");
    }

    const amt = new BigNumber(amount).multipliedBy(EXPONENT.toString()).integerValue().toString();

    await removeLiquidity(connection, uid, ccy, BigInt(amt));

    res.send("OK");
  } catch (err: any) {
    console.error(err);
    res.status(500).send(err.toString());
  }
});

/**
 * GET request for getting buy swap quotes
 * URL query params: base, quote, isBuy, and exactly one of amountBase, amountQuote
 */
app.get("/api/quote", [isLoggedInMiddleware], async (req: Request, res: Response<ServerResponse<QuoteResponse>>) => {
  try {
    let { base, quote, amountBase, amountQuote, isBuy } = req.query;

    let error: ResponseError = { type: "INVALID_ARGUMENTS" };

    if (base == null || quote == null || isBuy == null) {
      return res.status(400).send({ error });
    }

    if (isBuy != "true" && isBuy != "false") {
      return res.status(400).send({ error });
    }
    const _buy = isBuy === "true";

    if (amountBase == null && amountQuote == null) {
      return res.status(400).send({ error });
    }
    if (amountBase != null && amountQuote != null) {
      return res.status(400).send({ error });
    }

    const amountIsInput = _buy ? amountQuote != null : amountBase != null;

    const amount = amountBase || amountQuote;
    const amt = new BigNumber(amount!.toString()).multipliedBy(EXPONENT.toString()).integerValue().toString();

    let quoteRes: ServerResponse<QuoteResponse>;
    if (_buy) {
      quoteRes = await getBuyQuote(connection, base.toString(), quote.toString(), amt, amountIsInput);
    } else {
      quoteRes = await getSellQuote(connection, base.toString(), quote.toString(), amt, amountIsInput);
    }

    if (quoteRes.error != null) {
      return res.status(404).send(quoteRes);
    }

    const _response = {
      data: {
        ...quoteRes.data!,
        amtCcy1: new BigNumber(quoteRes.data!.amtCcy1).dividedBy(EXPONENT.toString()).toString(),
        amtCcy2: new BigNumber(quoteRes.data!.amtCcy2).dividedBy(EXPONENT.toString()).toString(),
      },
    };

    res.send(_response);
  } catch (err: any) {
    console.error(err);
    res.status(500).send(err.toString());
  }
});

/**
 * List pairs on exchange
 */
app.get("/api/pairs", async (req: Request, res: Response) => {
  try {
    const pairs = await listPairs(connection);
    res.send(pairs);
  } catch (err: any) {
    console.error(err);
    res.status(500).send(err.toString());
  }
});

app.listen(PORT, () => {
  console.log(`Hello world listening on port ${PORT}`);
});
