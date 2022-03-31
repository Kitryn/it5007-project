import BaseForm from "./BaseForm"
import "./tab.css"
import React, { useState } from "react"

export default function CashPage() {
    const [isDeposit, setIsDeposit] = useState(true)

    function onClickHandler(isDeposit: boolean) {
        setIsDeposit(isDeposit)
    }

    return (
        <div className="container">
            <div className="card">
                <div className="row m-0">
                    <div className="col py-3 border-end">
                        <button
                            onClick={() => onClickHandler(true)}
                            className={
                                "cash-btn btn btn-white w-100 fs-1" +
                                (isDeposit
                                    ? " text-dark fw-bold"
                                    : " text-muted")
                            }
                        >
                            DEPOSIT
                        </button>
                    </div>
                    <div className="col py-3 border-start">
                        <button
                            onClick={() => onClickHandler(false)}
                            className={
                                "cash-btn btn btn-white w-100 fs-1" +
                                (!isDeposit
                                    ? " text-dark fw-bold"
                                    : " text-muted")
                            }
                        >
                            Withdraw
                        </button>
                    </div>
                </div>
                <div>
                    <BaseForm isDeposit={isDeposit} />
                </div>
            </div>
        </div>
    )
}
