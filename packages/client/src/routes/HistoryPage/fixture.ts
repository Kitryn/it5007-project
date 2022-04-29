import { History } from "../../data"

export const PLACEHOLDER_HISTORY: History[] = [
    {
        date: new Date().toLocaleString(),
        base: "ETH",
        quote: "SGD",
        amt: "1",
        price: "4567",
    },
    {
        date: new Date().toLocaleString(),
        base: "BTC",
        quote: "SGD",
        amt: "0.03",
        price: "12345",
    },
    {
        date: new Date().toLocaleString(),
        base: "SGD",
        quote: "BTC",
        amt: "12412",
        price: "0.04",
    },
]
