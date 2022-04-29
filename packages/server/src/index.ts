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
import { getCoinBalances, getLpCoinValues, getTransactionHistory, upsertBalance, upsertRequest } from "./models/wallet";
import { CoinBalance, RequestStatus, RequestType, Wallet } from "./types";
import { EXPONENT } from "./constants";
import BigNumber from "bignumber.js";
import { addLiquidity, createPair, getPrices, swap } from "./models/pool";

const PORT = process.env.PORT ?? 3000;
const app = express();
const HOT_WALLET = "0x0d7b26Bfa1D36e648513a80c8D6172583E7a2c5E";

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
const dbSocketPath = process.env.DB_SOCKET_PATH || "/cloudsql";
const connection = mysql.createConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  socketPath: `${dbSocketPath}/${process.env.INSTANCE_CONNECTION_NAME}`,
  supportBigNumbers: true,
  bigNumberStrings: true,
});

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

    await addLiquidity(connection, uid, "BTC", "SGD", 1n * EXPONENT, 100000n * EXPONENT);
    await addLiquidity(connection, uid, "ETH", "SGD", 2n * EXPONENT, 1000n * EXPONENT);
    await addLiquidity(connection, uid, "SOL", "SGD", 3n * EXPONENT, 1000n * EXPONENT);

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
app.post("/api/swap", [isLoggedInMiddleware], async (req: Request, res: Response) => {
  try {
    const uid = req.decodedToken!.uid;
    const { base, quote, amount, isBuy }: { base: string; quote: string; amount: number; isBuy: boolean } = req.body;

    const amt = new BigNumber(amount).multipliedBy(EXPONENT.toString()).toString();
    await swap(connection, uid, base, quote, amt, isBuy);
    res.send("OK");
  } catch (err: any) {
    console.error(err);
    res.status(400).send(err.toString()); // don't send err message in real app
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

    const { ccy, amount }: { ccy: string; amount: number } = req.body;

    // in a real app we should have a validator middleware or library to check ccy, amount, etc
    await upsertRequest(
      connection,
      uid,
      RequestType.WITHDRAW,
      RequestStatus.PENDING,
      ccy,
      new BigNumber(amount).multipliedBy(EXPONENT.toString()).toString(),
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

    const amtBase = BigInt(new BigNumber(amountBase).multipliedBy(EXPONENT.toString()).toString());
    const amtQuote = BigInt(new BigNumber(amountQuote).multipliedBy(EXPONENT.toString()).toString());

    await addLiquidity(connection, uid, base, quote, amtBase, amtQuote);
  } catch (err: any) {
    console.error(err);
    res.status(500).send(err.toString());
  }
});

app.listen(PORT, () => {
  console.log(`Hello world listening on port ${PORT}`);
});
