import { useState } from "react"
import PushableButton from "../../components/UI/PushableButton/PushableButton"
import Console from "./Console"
import "./style.css"
const LiquidityPage = () => {
    const selection = ["BTC", "ETH", "COI", "KJS"]
    const [token1, setToken1] = useState("")
    const [token2, setToken2] = useState("")

    function onSelectHanderToken1(e: any) {
        setToken1(e.target.innerText)
    }
    function onSelectHanderToken2(e: any) {
        setToken2(e.target.innerText)
    }

    return (
        <>
            <div className="container liquidity">
                <div className="card">
                    <div className="row m-0">
                        <div className="col border-end py-3">
                            <span
                                className="w-100 btn btn-white fs-1 text-dark fw-bold"
                                style={{ cursor: "auto" }}
                            >
                                Add Liquidity
                            </span>
                        </div>
                    </div>
                    <Console
                        token={token1}
                        selection={selection}
                        onSelectHander={onSelectHanderToken1}
                        autoFocus={true}
                    ></Console>
                    <div className="row m-0 py-3"></div>
                    <Console
                        token={token2}
                        selection={selection}
                        onSelectHander={onSelectHanderToken2}
                        autoFocus={false}
                    ></Console>
                    <div className="row py-3">
                        {token1 && token2 ? (
                            <>
                                <div className="col-2"></div>
                                <div className="col-8">
                                    <div className="row border-bottom text-muted fs-4 ">
                                        <div className="col">
                                            <p className="text-start">Rate</p>
                                        </div>
                                        <div className="col">
                                            <p className="text-end">
                                                <span>1 {token1} </span>
                                                <span>=</span>
                                                <span>0.000001 {token2}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row text-muted fs-4 pt-3">
                                        <div className="col">
                                            <p className="text-start">
                                                Share of pool
                                            </p>
                                        </div>
                                        <div className="col">
                                            <p className="text-end">0.02%</p>
                                        </div>
                                    </div>
                                    <div className="row pt-3">
                                        <PushableButton>Approve</PushableButton>
                                    </div>
                                </div>
                                <div className="col-2"></div>
                            </>
                        ) : (
                            <div className="row text-center p-1 ">
                                <span className="text-secondary ">
                                    <em>Please select a token to begin</em>
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default LiquidityPage
