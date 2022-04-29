import fs from "fs";
import path from "path";

export const SQL_CREATE_TABLE_BALANCES = fs.readFileSync(path.join(__dirname, `./sql/balances.sql`), "utf8").toString();
export const SQL_CREATE_TABLE_CURRENCIES = fs
  .readFileSync(path.join(__dirname, `./sql/currencies.sql`), "utf8")
  .toString();
export const SQL_CREATE_TABLE_PAIRS = fs.readFileSync(path.join(__dirname, `./sql/pairs.sql`), "utf8").toString();
export const SQL_CREATE_TABLE_TRANSACTIONS = fs
  .readFileSync(path.join(__dirname, `./sql/transactions.sql`), "utf8")
  .toString();
export const SQL_CREATE_TABLE_RESERVES = fs.readFileSync(path.join(__dirname, `./sql/reserves.sql`), "utf8").toString();
