import mysql from "mysql2";
import {
  SQL_CREATE_TABLE_BALANCES,
  SQL_CREATE_TABLE_CURRENCIES,
  SQL_CREATE_TABLE_PAIRS,
  SQL_CREATE_TABLE_REQUESTS,
  SQL_CREATE_TABLE_RESERVES,
  SQL_CREATE_TABLE_TRANSACTIONS,
} from "./schema";

export async function createTables(connection: mysql.Connection) {
  await connection.promise().execute(SQL_CREATE_TABLE_CURRENCIES);
  // problematic query
  try {
    await connection.promise().execute(SQL_CREATE_TABLE_BALANCES);
    await connection.promise().execute(SQL_CREATE_TABLE_PAIRS);
  } catch (err: any) {
    // ignore
    console.warn(err);
  }
  await connection.promise().execute(SQL_CREATE_TABLE_RESERVES);
  await connection.promise().execute(SQL_CREATE_TABLE_TRANSACTIONS);
  await connection.promise().execute(SQL_CREATE_TABLE_REQUESTS);
}

export async function createCurrencies(connection: mysql.Connection) {
  await connection.promise().execute(`
    INSERT IGNORE INTO currencies (name, symbol)
    VALUES
      ('Bitcoin', 'BTC'),
      ('Ethereum', 'ETH'),
      ('Solana', 'SOL'),
      ('Singapore Dollar', 'SGD');
  `);
}
