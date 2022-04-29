import path from "path";
import dotenv from "dotenv";
dotenv.config({
  path: path.join(__dirname, "../../../.env"),
});

import express from "express";
import { Request, Response } from "express";
import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import mysql from "mysql2";

import { isAdminMiddleware, isLoggedInMiddleware } from "./auth";
import { createCurrencies, createTables } from "./models/initialiseDb";
import { getCoinBalances, getLpBalances, getLpCoinValues, upsertBalance } from "./models/wallet";
import { CoinBalance, Wallet } from "./types";
import { EXPONENT } from "./constants";
import BigNumber from "bignumber.js";
import { addLiquidity, createPair, getPrices, swap } from "./models/pool";

const PORT = process.env.PORT ?? 3000;
const app = express();

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

const defaultAuth = getAuth();

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
    console.log(req.body);
    const { ccy1, ccy2, amount, isBuy }: { ccy1: string; ccy2: string; amount: number; isBuy: boolean } = req.body;

    const amt = new BigNumber(amount).multipliedBy(EXPONENT.toString()).toString();
    await swap(connection, uid, ccy1, ccy2, amt, isBuy);
    res.send("OK");
  } catch (err: any) {
    console.error(err);
    res.status(401).send(err.toString()); // don't send err message in real app
  }
});

// GET endpoint for transaction route
// Reads url params ccy_in, ccy_out, amt_in, amt_out
app.get("/api/transaction", (req, res) => {
  const { ccy_in, ccy_out, amt_in, amt_out } = req.query;
  res.send({
    route: {
      ccy_in,
      ccy_out,
      amt_in,
      amt_out,
      fee: "0.00",
      price: "0.00",
      slippage: "0.00",
    },
  });
});

// GET endpoint for history
// Reads url params date_from and date_to
app.get("/api/history", (req, res) => {
  const { date_from, date_to } = req.query;
  res.send({
    history: [
      {
        date: "2020-01-01",
        ccy_in: "USD",
        ccy_out: "BTC",
        amt_in: "0.00",
        amt_out: "0.00",
        price: "0.00",
      },
      {
        date: "2020-01-02",
        ccy_in: "USD",
        ccy_out: "BTC",
        amt_in: "0.00",
        amt_out: "0.00",
        price: "0.00",
      },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`Hello world listening on port ${PORT}`);
});
