import { useEffect, useRef, useState } from "react"
import { clearTimeout } from "timers"
import { getPairs, getQuote } from "../../api"
import PushableButton from "../../components/UI/PushableButton"
import "./form.css"
import { useDebounce } from "use-debounce"
import { Quote } from "../../data"

const SwapForm = () => {
    const [selectedCurrencyPrimary, setSelectedCurrencyPrimary] =
        useState("SGD")
    const [selectedCurrencySecondary, setSelectedCurrencySecondary] =
        useState("BTC")

    // Delayed input
    const [upperInput, setUpperInput] = useState<number>(0)
    const [upperInputDelayed] = useDebounce(upperInput, 1000)

    const [selections, setSelections] = useState<string[]>()
    const htmlRef = useRef<HTMLInputElement>(null)
    const [quotation, setQuotation] = useState<Quote>()

    useEffect(() => {
        getPairs().then((pairs) => {
            if (pairs) {
                setSelections(
                    [...pairs.map((value) => value.base), "SGD"].sort()
                )
            }
        })
    }, [])

    function onSelectHanderPrimary(e: any) {
        setSelectedCurrencyPrimary(e.target.innerText)
    }
    function onSelectHanderSecondary(e: any) {
        setSelectedCurrencySecondary(e.target.innerText)
    }

    useEffect(() => {
        selections?.sort()

        if (selections) {
            if (selectedCurrencyPrimary === "SGD") {
                setSelectedCurrencySecondary(
                    selections.filter((s) => s !== "SGD")[0]
                )
            } else {
                setSelectedCurrencySecondary("SGD")
            }
        }

        setUpperInput(0)
        setQuotation(undefined)
        const node = htmlRef.current
        if (node) {
            node.value = ""
        }
    }, [selections, selectedCurrencyPrimary])

    useEffect(() => {
        const quotation: {
            base: string
            quote: string
            isBuy: boolean
            amountBase?: number
            amountQuote?: number
        } = {
            base: "",
            quote: "SGD",
            isBuy: true,
            amountBase: undefined,
            amountQuote: undefined,
        }
        if (upperInput > 0) {
            if (selectedCurrencyPrimary === "SGD") {
                quotation.base = selectedCurrencySecondary
                quotation.amountQuote = upperInputDelayed
                quotation.isBuy = false
            } else {
                quotation.base = selectedCurrencyPrimary
                quotation.amountBase = upperInputDelayed
                quotation.isBuy = true
            }
            console.log(quotation)

            getQuote(
                quotation.base,
                quotation.quote,
                quotation.isBuy,
                quotation.amountBase,
                quotation.amountQuote
            )
                .then((res) => {
                    if (res) {
                        setQuotation(res)
                        console.log(res)
                    }
                })
                .catch((err) => {
                    alert("Not Enough Funds")
                })
        }
    }, [upperInputDelayed, selectedCurrencySecondary])

    function onSubmitHandler(e: any) {
        e.preventDefault()
    }
    return (
        <>
            <div
                className="row py-1 px-5 bg-primary m-0 swap-form"
                style={{
                    height: 180,
                }}
            >
                <div className="col">
                    <div className="row py-3">
                        <h4 className="text-white ">I want to swap</h4>
                    </div>
                    <div className="row py-1">
                        <div className="col">
                            <input
                                type="text"
                                className="form-control-lg border-0 bg-primary fw-bold text-white p-0 m-0"
                                maxLength={9}
                                aria-label="Amount"
                                style={{
                                    width: "9em",
                                    fontSize: "3em",
                                }}
                                placeholder="0.00"
                                autoFocus
                                ref={htmlRef}
                                onChange={(e) => {
                                    const value = e.target.value
                                    if (
                                        value &&
                                        Number(value) == parseFloat(value)
                                    ) {
                                        setUpperInput(parseFloat(value))
                                    } else {
                                        setUpperInput(0)
                                    }
                                }}
                            ></input>
                        </div>
                        <div className="col-3">
                            <div className="btn-group">
                                <span className="btn btn-primary selection pe-5">
                                    {selectedCurrencyPrimary +
                                        " ".repeat(
                                            5 - selectedCurrencyPrimary.length
                                        )}
                                </span>
                                <button
                                    type="button"
                                    className="btn btn-primary selection dropdown-toggle dropdown-toggle-split"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <span className="visually-hidden">
                                        Toggle Dropdown
                                    </span>
                                </button>
                                <ul className="dropdown-menu">
                                    {selections?.map((coin) => (
                                        <li key={coin}>
                                            <a
                                                className="dropdown-item"
                                                href="#"
                                                onClick={(e) =>
                                                    onSelectHanderPrimary(e)
                                                }
                                            >
                                                {coin}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row m-0 py-3"></div>
            <div
                className="row m-0 px-5 bg-primary "
                style={{
                    height: 180,
                }}
            >
                (
                <div className="col">
                    <div className="row py-3">
                        <h4 className="text-white ">with</h4>
                    </div>
                    <div className="row py-1">
                        <div className="col">
                            <span
                                className="text-white p-0 m-0 fw-bold form-control-lg border-0 "
                                style={{
                                    width: "9em",
                                    fontSize: "3em",
                                }}
                            >
                                {quotation
                                    ? selectedCurrencyPrimary === "SGD"
                                        ? quotation.amtCcy1
                                        : quotation.amtCcy2
                                    : ""}
                            </span>
                        </div>
                        <div className="col-3">
                            <div className="btn-group">
                                <span className="btn btn-primary selection pe-5">
                                    {selectedCurrencySecondary +
                                        " ".repeat(
                                            5 - selectedCurrencySecondary.length
                                        )}
                                </span>
                                <button
                                    type="button"
                                    className="btn btn-primary selection dropdown-toggle dropdown-toggle-split"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <span className="visually-hidden">
                                        Toggle Dropdown
                                    </span>
                                </button>
                                <ul className="dropdown-menu">
                                    {selectedCurrencyPrimary === "SGD"
                                        ? selections
                                              ?.filter(
                                                  (option) => option !== "SGD"
                                              )
                                              .map((coin) => (
                                                  <li key={coin}>
                                                      <a
                                                          className="dropdown-item"
                                                          href="#"
                                                          onClick={(e) =>
                                                              onSelectHanderSecondary(
                                                                  e
                                                              )
                                                          }
                                                      >
                                                          {coin}
                                                      </a>
                                                  </li>
                                              ))
                                        : selections
                                              ?.filter(
                                                  (option) => option === "SGD"
                                              )
                                              .map((coin) => (
                                                  <li key={coin}>
                                                      <a
                                                          className="dropdown-item"
                                                          href="#"
                                                          onClick={(e) =>
                                                              onSelectHanderSecondary(
                                                                  e
                                                              )
                                                          }
                                                      >
                                                          {coin}
                                                      </a>
                                                  </li>
                                              ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                )
            </div>
            <div className="row py-3">
                {quotation ? (
                    <>
                        <div className="col-2"></div>
                        <div className="col-8">
                            <div className="row text-muted fs-3 pt-3">
                                <div className="col">
                                    <p className="text-start">Price</p>
                                </div>
                                <div className="col">
                                    <p className="text-end">
                                        1{selectedCurrencySecondary}@
                                        {quotation?.actualPrice.toFixed(2)} SGD
                                    </p>
                                </div>
                            </div>
                            <div className="row text-muted fs-3 pt-3">
                                <div className="col">
                                    <p className="text-start">Slippage</p>
                                </div>
                                <div className="col">
                                    <p className="text-end">
                                        {(
                                            Math.abs(quotation.slippage) * 100
                                        ).toFixed(1)}
                                        %
                                    </p>
                                </div>
                            </div>
                            <div className="row pt-3">
                                <PushableButton
                                    onClickHandler={onSubmitHandler}
                                >
                                    Swap
                                </PushableButton>
                            </div>
                        </div>
                        <div className="col-2"></div>
                    </>
                ) : (
                    <div className="row text-center p-1 ">
                        <span className="text-secondary ">
                            <em>
                                Input the amount of currency to you want to swap
                            </em>
                        </span>
                    </div>
                )}
            </div>
        </>
    )
}

export default SwapForm
