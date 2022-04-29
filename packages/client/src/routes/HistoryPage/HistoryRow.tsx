import { History } from "../../data"
import "./HistoryPage.css"

export default function HistoryRow({ fill }: { fill: History }) {
    const name = fill.base + "/" + fill.quote
    const textStyle = false ? "text-danger" : "text-success"

    return (
        <div className="row p-1 m-1">
            <div className="col-4">{name}</div>
            <div className={`col-2 history-xs ${textStyle}`}>
                {parseFloat(fill.amt) * parseFloat(fill.price)}
            </div>
            <div className={`col-3 history-xs ${textStyle}`}>
                {fill.amt} @ {fill.price}
            </div>
            <div className="col-3 history-sm">
                {new Date(fill.date).toLocaleString("en-gb")}
            </div>
        </div>
    )
}
