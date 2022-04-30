import { useRef } from "react"

import "./tab.css"
import SwapForm from "./SwapForm"

export default function CashPage() {
    interface TabState {
        isBuy: boolean
        isSell: boolean
        isSwap: boolean
    }

    return (
        <div className="container">
            <div className="card">
                <div className="row m-0">
                    <div className="col py-3 border-start">
                        <button
                            className={
                                "cash-btn btn btn-white w-100 fs-1 text-dark fw-bold"
                            }
                        >
                            Swap
                        </button>
                    </div>
                </div>
                <div>
                    <SwapForm></SwapForm>
                </div>
            </div>
        </div>
    )
}

