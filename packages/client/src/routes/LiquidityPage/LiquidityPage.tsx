import React, { useEffect, useState } from "react"
import { useDebounce } from "use-debounce"
import { getPairs, getPrices, getWallet, postAddLiquidity } from "../../api"
import PushableButton from "../../components/UI/PushableButton/PushableButton"
import { CoinBalance, Wallet } from "../../data"
import Console from "./Console"
import "./style.css"
const LiquidityPage = () => {
    const [baseCcy, setBaseCcy] = useState<string>("BTC")
    const [pairs, setPairs] = useState<string[]>(["BTC"])
    const [price, setPrice] = useState<number | undefined>(undefined)
    const [wallet, setWallet] = useState<{ [key: string]: CoinBalance }>({})

    const [upperAmount, setUpperAmount] = useState<string | undefined>(
        undefined
    )
    const [upperAmountDelayed, upperAmounceDebounceCallback] = useDebounce(
        upperAmount,
        1000
    )

    const onSelectBaseCcy = (e: any) => {
        setBaseCcy(e.target.innerText)
    }

    const onUpperInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Ensure the input is a valid number
        const value = Number(e.target.value)
        console.log(value)
        if (!value && value != 0 && !isNaN(value)) {
            console.log("huh")
            return setUpperAmount(undefined)
        }
        if (isNaN(value)) {
            return
        }
        console.log("wat")
        console.log(e.target.value)
        setUpperAmount(e.target.value)
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

    // Fetch current wallet
    useEffect(() => {
        getWallet().then((wallet) => {
            if (wallet) {
                setWallet(
                    wallet.coin_qty.reduce((acc, curr) => {
                        acc[curr.symbol] = curr
                        return acc
                    }, {})
                )
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

    // Reset page
    const reset = () => {
        setUpperAmount(undefined)
        upperAmounceDebounceCallback.flush()
    }

    // Submit liquidity request
    const onSubmitHandler = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Submit liquidity request")
        if (upperAmountDelayed == null || price == null) {
            return
        }
        postAddLiquidity(
            baseCcy,
            "SGD",
            parseFloat(upperAmountDelayed),
            price * parseFloat(upperAmountDelayed)
        ).then((success) => {
            console.log("Success: ", success)
            alert(
                success
                    ? "Successfully added liquidity"
                    : "Failed to add liquidity"
            )
            reset()
        })
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
                        token={baseCcy}
                        selection={pairs}
                        onSelectHander={onSelectBaseCcy}
                        autoFocus={true}
                        isStatic={false}
                        balance={wallet[baseCcy]?.qty ?? 0}
                        value={wallet[baseCcy]?.value ?? 0}
                        amount={upperAmount}
                        onAmountHandler={onUpperInputHandler}
                    ></Console>
                    <div className="row m-0 py-3"></div>
                    <Console
                        token={"SGD"}
                        selection={[]}
                        onSelectHander={() => {}}
                        autoFocus={false}
                        isStatic={true}
                        balance={wallet["SGD"]?.qty ?? 0}
                        value={wallet["SGD"]?.value ?? 0}
                        amount={
                            price
                                ? upperAmountDelayed == null ||
                                  upperAmountDelayed == ""
                                    ? undefined
                                    : (
                                          price * Number(upperAmountDelayed)
                                      ).toFixed(2)
                                : undefined
                        }
                        onAmountHandler={() => {}}
                    ></Console>
                    <div className="row py-3">
                        <div className="col-2"></div>
                        <div className="col-8">
                            <div className="row border-bottom text-muted fs-4 ">
                                <div className="col">
                                    <p className="text-start">Rate</p>
                                </div>
                                <div className="col">
                                    <p className="text-end">
                                        <span>1 {baseCcy}</span>
                                        <span> = </span>
                                        <span>
                                            {parseFloat(
                                                price?.toString() ?? "0"
                                            ).toFixed(2)}{" "}
                                            {"SGD"}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="row text-muted fs-4 pt-3">
                                {/* <div className="col">
                                    <p className="text-start">Share of pool</p>
                                </div>
                                <div className="col">
                                    <p className="text-end">0.02%</p>
                                </div> */}
                            </div>
                            <div className="row pt-3">
                                <PushableButton
                                    onClickHandler={onSubmitHandler}
                                >
                                    Approve
                                </PushableButton>
                            </div>
                        </div>
                        <div className="col-2"></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LiquidityPage
