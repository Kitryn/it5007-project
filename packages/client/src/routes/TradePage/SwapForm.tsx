import { useEffect, useRef, useState } from "react"
import PushableButton from "../../components/UI/PushableButton"
import "./form.css"

const SwapForm = ({ selected }) => {
    const selection = ["BTC", "ETH", "COI", "KJS"]
    const [selectedCurrency, setSelectedCurrency] = useState(selection[0])
    const upperRef = useRef<HTMLInputElement>(null)
    const lowerRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const node = upperRef.current
        if (node) {
            node.focus()
        }
    }, [selection])

    function onSelectHander(e: any) {
        setSelectedCurrency(e.target.innerText)
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
                        <h4 className="text-white ">
                            I want to {selected.toLowerCase()}
                        </h4>
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
                                    {selectedCurrency +
                                        " ".repeat(5 - selectedCurrency.length)}
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
                                    {selection.map((coin) => (
                                        <li key={coin}>
                                            <a
                                                className="dropdown-item"
                                                href="#"
                                                onClick={(e) =>
                                                    onSelectHander(e)
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
                                        {selectedCurrency +
                                            " ".repeat(
                                                5 - selectedCurrency.length
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
                                        {selection.map((coin) => (
                                            <li key={coin}>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                    onClick={(e) =>
                                                        onSelectHander(e)
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
                        <PushableButton>
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
