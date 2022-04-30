import { useEffect, useRef, useState } from "react"
import { getPairs } from "../../api"
import PushableButton from "../../components/UI/PushableButton"
import "./form.css"

const SwapForm = () => {
    const [selectedCurrencyPrimary, setSelectedCurrencyPrimary] =
        useState("SGD")
    const [selectedCurrencySecondary, setSelectedCurrencySecondary] =
        useState("BTC")
    const [pairs, setPairs] = useState<{ base: string; quote: string }[]>()
    const upperRef = useRef<HTMLInputElement>(null)
    const lowerRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        getPairs().then((pairs) => {
            if (pairs) {
                setPairs(pairs)
            }
        })
    }, [])

    const primarySelection = pairs ? pairs.map((value) => value.base) : []
    primarySelection.push("SGD")
    primarySelection.sort()

    const secondarySelection =
        selectedCurrencyPrimary === "SGD"
            ? pairs?.map((val) => val.base)
            : ["SGD"]

    secondarySelection?.sort()

    function onSelectHanderPrimary(e: any) {
        setSelectedCurrencyPrimary(e.target.innerText)
    }
    function onSelectHanderSecondary(e: any) {
        setSelectedCurrencySecondary(e.target.innerText)
    }

    useEffect(() => {
        setSelectedCurrencySecondary(
            secondarySelection ? secondarySelection[0] : "SGD"
        )
    }, [primarySelection])

    const selected = "Swap"
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
                                ref={upperRef}
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
                                    {primarySelection.map((coin) => (
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
                {selected === "Swap" ? (
                    <div className="col">
                        <div className="row py-3">
                            <h4 className="text-white ">with</h4>
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
                                    ref={lowerRef}
                                ></input>
                            </div>
                            <div className="col-3">
                                <div className="btn-group">
                                    <span className="btn btn-primary selection pe-5">
                                        {selectedCurrencySecondary +
                                            " ".repeat(
                                                5 -
                                                    selectedCurrencySecondary.length
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
                                        {secondarySelection?.map((coin) => (
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
                ) : null}
            </div>
            <div className="row py-3">
                <div className="col-2"></div>
                <div className="col-8">
                    {selected === "Swap" ? null : (
                        <div className="row border-bottom text-muted fs-3 ">
                            <div className="col">
                                <p className="text-start">
                                    {selected === "Buy" ? "Price" : "Earning"}
                                </p>
                            </div>
                            <div className="col">
                                <p className="text-end">{123123123} SGD</p>
                            </div>
                        </div>
                    )}
                    <div className="row text-muted fs-3 pt-3">
                        <div className="col">
                            <p className="text-start">Platform Fee</p>
                        </div>
                        <div className="col">
                            <p className="text-end">{123} SGD</p>
                        </div>
                    </div>
                    <div className="row pt-3">
                        <PushableButton onClickHandler={() => null}>
                            {selected.toUpperCase()}
                        </PushableButton>
                    </div>
                </div>
                <div className="col-2"></div>
            </div>
        </>
    )
}

export default SwapForm
