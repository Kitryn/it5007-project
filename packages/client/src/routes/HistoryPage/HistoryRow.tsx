import { OrderFill } from "../../data"
import "./HistoryPage.css"

export default function HistoryRow({ fill }: { fill: OrderFill }) {
    const sign = fill.amount.slice(0, 1)
    const absoluteAmount = fill.amount.slice(1)
    const textStyle = sign === "-" ? "text-danger" : "text-success"

    return (
        <div className="row p-1 m-1">
            <div className="col-4">{fill.name}</div>
            <div className={`col-2 history-xs ${textStyle}`}>
                {sign} {absoluteAmount}
            </div>
            <div className={`col-3 history-xs ${textStyle}`}>
                {fill.volume} @ {fill.price}
            </div>
            <div className="col-3 history-sm">
                {new Date(fill.time).toLocaleString("en-gb")}
            </div>
        </div>
    )
}
