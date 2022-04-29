// May be replaced by ORM stuff
export interface Wallet {
  fiat: string;
  crypto: string;
  earning: string;
  coin_qty: CoinBalance[];
}

export interface CoinBalance {
  name: string;
  symbol: string;
  price: number;
  qty: string;
  value: string;
  earning: string;
  earningValue: string;
}

export interface Route {
  ccy_in: string;
  ccy_out: string;
  amt_in: string;
  amt_out: string;
  fee: string;
  price: string;
  slippage: string;
}

export interface History {
  date: string;
  base: string;
  quote: string;
  amt: string;
  price: string;
}

export enum RequestType {
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
}

export enum RequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}
