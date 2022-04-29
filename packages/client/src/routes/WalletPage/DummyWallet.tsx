import { Wallet, CoinBalance } from "../../data"

const COIN1: CoinBalance = {
    name: "coin1",
    symbol: "COIN1",
    price: 1.5,
    qty: "0.85",
    value: "7462",
    earning: "321.3",
    earningValue: "42069",
}
const COIN2: CoinBalance = {
    name: "coin2",
    symbol: "COIN2",
    price: 0.69,
    qty: "1.34",
    value: "563",
    earning: "-3212",
    earningValue: "42069",
}
const COIN3: CoinBalance = {
    name: "coin3",
    symbol: "COIN3",
    price: 420,
    qty: "10000",
    value: "1.32",
    earning: "-99203",
    earningValue: "42069",
}
export const WALLET: Wallet = {
    fiat: "8888.88",
    crypto: "7777.77",
    earning: "666.66",
    coin_qty: [COIN1, COIN2, COIN3],
}
