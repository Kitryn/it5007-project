import { useEffect, useState } from "react"
import { getPairs, getPrices } from "../../api"
import PushableButton from "../../components/UI/PushableButton/PushableButton"
import Console from "./Console"
import "./style.css"
const LiquidityPage = () => {
    const [baseCcy, setBaseCcy] = useState<string>("BTC")
    const [pairs, setPairs] = useState<string[]>(["BTC"])
    const [price, setPrice] = useState<number | undefined>(undefined)

    function onSelectBaseCcy(e: any) {
        setBaseCcy(e.target.innerText)
    }

    // Fetch the list of currencies
    useEffect(() => {
        getPairs().then((res) => {
            // Quote is always SGD
            const pairs = res?.map((pair) => pair.base)
            if (pairs) {
                setPairs(pairs)
            }
        })
    }, [])

    // Fetch price for the currently selected asset
    useEffect(() => {
        getPrices([baseCcy]).then((res) => {
            const price = res?.[0].price
            if (price) {
                setPrice(price)
            }
        })
    }, [baseCcy])

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
                        token={baseCcy}
                        selection={pairs}
                        onSelectHander={onSelectBaseCcy}
                        autoFocus={true}
                        isStatic={false}
                        balance={100}
                        value={100}
                    ></Console>
                    <div className="row m-0 py-3"></div>
                    <Console
                        token={baseCcy}
                        selection={pairs}
                        onSelectHander={onSelectBaseCcy}
                        autoFocus={false}
                        isStatic={true}
                        balance={100}
                        value={100.123}
                    ></Console>
                    <div className="row py-3">
                        {baseCcy && baseCcy ? (
                            <>
                                <div className="col-2"></div>
                                <div className="col-8">
                                    <div className="row border-bottom text-muted fs-4 ">
                                        <div className="col">
                                            <p className="text-start">Rate</p>
                                        </div>
                                        <div className="col">
                                            <p className="text-end">
                                                <span>1 {baseCcy} </span>
                                                <span>=</span>
                                                <span>0.000001 {baseCcy}</span>
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
                                        <PushableButton
                                            onClickHandler={() => null}
                                        >
                                            Approve
                                        </PushableButton>
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
