// TODO: FIX DOCSTRINGS
/**
 * Get balances
 * fiat: flat asset value
 * crypto: crypto asset value
 * earning: sum of coin balance earning
 * coin_qty: array of CoinBalance Object
 */
export interface Wallet {
    fiat: string
    crypto: string
    earning: string
    claimed?: boolean
    coin_qty: CoinBalance[]
}

/**
 * each coin the user owned is represented as a CoinBalance Object
 * name: name of the coin
 * qty: number of coin owned
 * value: value of the owned coin at query time
 * earning: approximate fliat value of this coin that are currently locked in for Earning
 */

export interface CoinBalance {
    name: string
    symbol: string
    price: number
    qty: string
    value: string
    earning: string
    earningValue: string
}

export interface StakedToken {
    amount: string
    name: string
    symbol: string
    ccy1Name: string
    ccy1Symbol: string
    ccy2Name: string
    ccy2Symbol: string
}

export interface StakedTokenValue {
    base: string
    quote: string
    baseAmount: string
    quoteAmount: string
    baseValue: string
    quoteValue: string
}

export interface Price {
    ccy: string
    price: number
}

/**
 * History
 * GET request with date_from and date_to. Concat ccy_in and ccy_out to get the pair
 */
export interface History {
    date: string
    base: string
    quote: string
    amt: string // amount in base
    price: string
}

export interface Quote {
    idealPrice: number
    actualPrice: number
    amtCcy1: string
    amtCcy2: string
    slippage: number
}

export interface ResponseError {
    type: "USER_NO_FUNDS" | "INSUFFICIENT_LIQUIDITY" | "INVALID_ARGUMENTS"
    message?: string
}

export interface ServerResponse<T> {
    data?: T
    error?: ResponseError
}

export interface SwapResponse {
    base: string
    quote: string
    isBuy: boolean
    amtBase: string
    amtQuote: string
    actualPrice: string
}
