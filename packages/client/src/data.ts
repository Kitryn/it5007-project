export interface OrderFill {
    name: string
    amount: string
    price: string
    volume: string
    time: number
}

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
    qty: string
    value: string
    earning: string
}

/**
 * Get route
 * GET request with params `ccy_in` and `ccy_out`
 * Route: list of ccys e.g. [BTC, USD, ETH]
 * If route is length 2, don't display anything.
 * If route is >2, this means we don't have a direct pair between
 * ccy_in and ccy_out so multiple swaps on the back end will be made; display on UI
 */
export interface Route {
    ccy_in: string
    ccy_out: string
    amt_in: string
    amt_out: string
    price: string
    slippage: string
    fee: string
    route: string[]
}

/**
 * History
 * GET request with date_from and date_to. Concat ccy_in and ccy_out to get the pair
 */
export interface History {
    date: string
    ccy_in: string
    ccy_out: string
    amount_in: string // amount in ccy_in
    amount_out: string // amount in ccy_out
    price: string // abs(amount_in / amount_out)?
}
