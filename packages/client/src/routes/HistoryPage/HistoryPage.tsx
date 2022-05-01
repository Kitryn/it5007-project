import HistoryRow from "./HistoryRow"
import DatePicker from "../../components/DatePicker"
import SearchBar from "../../components/SearchBar"
import "./HistoryPage.css"
import React, { useEffect, useState } from "react"
import date from "date-and-time"
import { getHistory } from "../../api"
import { History } from "../../data"

export default function HistoryPage() {
    const today = new Date()
    const [fromDate, setFromDate] = useState(date.addMonths(today, -3))
    const [toDate, setToDate] = useState(today)
    const [searchWord, setSearchWord] = useState("")
    const [history, setHistory] = useState<History[]>([])

    // history dataloaded
    useEffect(() => {
        getHistory().then((data) => {
            const history = data
            if (history) {
                setHistory(history)
            }
        })
    }, [])

    const filteredHistory = history.filter(
        (val: History) =>
            date.subtract(new Date(val.date), fromDate).toDays() >= 0 &&
            date.subtract(toDate, new Date(val.date)).toDays() >= 0 &&
            (val.base + val.quote).includes(searchWord)
    )

    return (
        <div className="container d-flex flex-column">
            <div className="row header">
                <div className="col-9 bg-white px-5 py-2 m-2 flex-grow-1 border rounded-pill d-flex justify-content-between align-items-center">
                    <DatePicker
                        defaultDate={fromDate}
                        setNewDate={setFromDate}
                    />
                    <div className="col-2 text-center fw-bold text-muted">
                        to
                    </div>
                    <DatePicker defaultDate={toDate} setNewDate={setToDate} />
                </div>
                <div className="col-2 bg-white px-4 py-2 m-2 border rounded-pill">
                    <SearchBar setSearchState={setSearchWord} />
                </div>
            </div>
            <div className="row flex-grow-1">
                <div className="col-12 h-100 container-fluid text-muted">
                    <div className="row">
                        <div className="col-2 bg-white border  history-header-element">
                            Transaction
                        </div>
                        <div className="col-3 bg-white border  history-header-element">
                            Est. Value (SGD)
                        </div>
                        <div className="col-4 bg-white border  history-header-element">
                            Order
                        </div>
                        <div className="col-3 bg-white border  history-header-element">
                            Time
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 bg-white border history-container">
                            {filteredHistory.map((fill, index) => (
                                <HistoryRow key={index} fill={fill} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
