import HistoryRow from "./HistoryRow"
import "./HistoryPage.css"
import React from "react"

import { PLACEHOLDER_HISTORY } from "./fixture"

export default function HistoryPage() {
    let asd: React.RefObject<HTMLInputElement> = React.createRef()

    return (
        <div className="container d-flex flex-column">
            <div className="row header">
                <div className="col-9 bg-white px-3 py-2 m-2 flex-grow-1 border rounded-pill">
                    date selector
                </div>
                <div className="col-2 bg-white px-3 py-2 m-2 border rounded-pill">
                    searchbar
                </div>
            </div>
            <div className="row flex-grow-1">
                <div className="col-12 h-100 container-fluid">
                    <div className="row">
                        <div className="col-4 bg-white border history-header-element">
                            Name
                        </div>
                        <div className="col-2 bg-white border history-header-element">
                            Amount
                        </div>
                        <div className="col-3 bg-white border history-header-element">
                            Filled
                        </div>
                        <div className="col-3 bg-white border history-header-element">
                            Time
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 bg-white border history-container">
                            {PLACEHOLDER_HISTORY.map((fill, index) => (
                                <HistoryRow key={index} fill={fill} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
