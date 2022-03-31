import { useRef } from "react"

export default function TradePage() {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-6 border border-primary rounded-3 bg-light">
                    <div className="col bg-primary py-3 px-4 mt-4 mx-4 text-white">
                        <span className="fs-3">Swap</span>
                    </div>
                    <div className="col text-dark p-4">
                        <SwapForm />
                    </div>
                </div>
            </div>
        </div>
    )
}

function SwapForm() {
    const inputRef = useRef<HTMLInputElement>(null)
    const outputRef = useRef<HTMLInputElement>(null)

    return (
        <form className="form-floating mb-3 d-flex flex-column align-items-center">
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
