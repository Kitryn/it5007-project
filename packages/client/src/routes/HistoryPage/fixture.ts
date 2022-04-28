import { History } from "../../data"

export const PLACEHOLDER_HISTORY: History[] = [
    {
        date: new Date().toLocaleString(),
        ccy_in: "ETH",
        ccy_out: "SGD",
        amount_in: "1",
        amount_out: "34053",
        get price() {
            return (parseFloat(this.amount_in) / parseFloat(this.amount_out))
                .toPrecision(15)
                .slice(0, 13)
        },
    },
    {
        date: new Date().toLocaleString(),
        ccy_in: "BTC",
        ccy_out: "SGD",
        amount_in: "0.03",
        amount_out: "65920",
        get price() {
            return (parseFloat(this.amount_in) / parseFloat(this.amount_out))
                .toPrecision(15)
                .slice(0, 13)
        },
    },
    {
        date: new Date().toLocaleString(),
        ccy_in: "SGD",
        ccy_out: "BTC",
        amount_in: "12412",
        amount_out: "0.04",
        get price() {
            return (parseFloat(this.amount_in) / parseFloat(this.amount_out))
                .toPrecision(15)
                .slice(0, 13)
        },
    },
]
