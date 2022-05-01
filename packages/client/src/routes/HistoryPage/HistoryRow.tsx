import { History } from "../../data"
import "./HistoryPage.css"

export default function HistoryRow({ fill }: { fill: History }) {
    const direction = +fill.amt < 0
    const textStyle = direction ? "text-danger" : "text-success"
    const name = !direction
        ? fill.base + "/" + fill.quote
        : fill.quote + "/" + fill.base

    const transcation = !direction
        ? parseFloat(fill.amt).toFixed(5) +
          fill.base +
          " @ " +
          parseFloat(fill.price).toFixed(5) +
          fill.quote
        : parseFloat(fill.price).toFixed(5) +
          fill.quote +
          " @ " +
          parseFloat(fill.amt).toFixed(5) +
          fill.base
    console.log(transcation)

    return (
        <div className="row p-1 m-1">
            <div className="col-2">{name}</div>
            <div className={`col-3 history-xs `}>
                {Math.abs(
                    parseFloat(fill.amt) * parseFloat(fill.price)
                ).toFixed(5)}
            </div>
            <div className={`col-4 history-xs px-4`}>
                <div className="row text-end">
                    <div className={`p-0 col-1  ${textStyle}`}>
                        {direction ? "BUY" : "SELL"}
                    </div>
                    <div className=" p-0 col-3">
                        {Math.abs(parseFloat(fill.amt)).toFixed(5) +
                            " " +
                            fill.base}
                    </div>
                    <div className=" p-0 col-1">@</div>
                    <div className=" p-0 col-5 text-start ps-3">
                        {fill.price} {fill.quote}
                    </div>
                </div>
            </div>
            <div className="col-3 history-sm ps-5">
                {new Date(fill.date).toLocaleString("en-gb")}
            </div>
        </div>
    )
}
