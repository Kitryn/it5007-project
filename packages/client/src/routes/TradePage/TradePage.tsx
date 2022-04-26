import { useRef } from "react"

import "./tab.css"
import React, { useState } from "react"
import SwapForm from "./SwapForm"
import { useParams } from "react-router-dom"

export default function CashPage() {
    interface TabState {
        isBuy: boolean
        isSell: boolean
        isSwap: boolean
    }
    const { operation } = useParams()

    const [tabState, setTabState] = useState<TabState>({
        isBuy: operation === "buy" || operation === undefined,
        isSell: operation === "sell",
        isSwap: operation === "swap",
    })

    const [activeTab, setActiveTab] = useState("Buy")

    function onClickHandler(e: any, newState: TabState) {
        setActiveTab(e.target.innerText)
        setTabState(newState)
    }

    return (
        <div className="container">
            <div className="card">
                <div className="row m-0">
                    <div className="col py-3 border-end">
                        <button
                            onClick={(e) =>
                                onClickHandler(e, {
                                    isBuy: true,
                                    isSell: false,
                                    isSwap: false,
                                })
                            }
                            className={
                                "cash-btn btn btn-white w-100 fs-1" +
                                (tabState.isBuy
                                    ? " text-dark fw-bold"
                                    : " text-muted")
                            }
                        >
                            Buy
                        </button>
                    </div>
                    <div className="col py-3 border-start">
                        <button
                            onClick={(e) =>
                                onClickHandler(e, {
                                    isBuy: false,
                                    isSell: true,
                                    isSwap: false,
                                })
                            }
                            className={
                                "cash-btn btn btn-white w-100 fs-1" +
                                (tabState.isSell
                                    ? " text-dark fw-bold"
                                    : " text-muted")
                            }
                        >
                            Sell
                        </button>
                    </div>
                    <div className="col py-3 border-start">
                        <button
                            onClick={(e) =>
                                onClickHandler(e, {
                                    isBuy: false,
                                    isSell: false,
                                    isSwap: true,
                                })
                            }
                            className={
                                "cash-btn btn btn-white w-100 fs-1" +
                                (tabState.isSwap
                                    ? " text-dark fw-bold"
                                    : " text-muted")
                            }
                        >
                            Swap
                        </button>
                    </div>
                </div>
                <div>
                    <SwapForm selected={activeTab}></SwapForm>
                </div>
            </div>
        </div>
    )
}

function SwapForm_() {
    const inputRef = useRef<HTMLInputElement>(null)
    const outputRef = useRef<HTMLInputElement>(null)

    return (
        <form
            className="form-floating mb-3 d-flex flex-column align-items-center"
            id="swapForm"
        >
            <div className="input-group my-3 input-group-lg">
                <input
                    className="form-control position-relative"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    type="text"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    minLength={1}
                    maxLength={50}
                    id="inputAmount"
                    placeholder="0.0"
                    ref={inputRef}
                    aria-describedby="inputCcy"
                />
                <select
                    className="form-control btn btn-outline-secondary"
                    id="inputCcy"
                >
                    <option>EUR</option>
                    <option>USD</option>
                    <option>GBP</option>
                </select>
            </div>
            <button className="btn btn-primary w-25" type="button">
                <i className="bi bi-arrow-bar-down"></i>
            </button>
            <div className="input-group my-3 input-group-lg">
                <input
                    className="form-control position-relative"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    type="text"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    minLength={1}
                    maxLength={50}
                    id="outputAmount"
                    placeholder="0.0"
                    ref={outputRef}
                    aria-describedby="outputCcy"
                />
                <select
                    className="form-control btn btn-outline-secondary"
                    id="outputCcy"
                >
                    <option>EUR</option>
                    <option>USD</option>
                    <option>GBP</option>
                </select>
            </div>
        </form>
    )
}
