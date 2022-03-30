import "./form.css"

export default function DepositForm() {
    return (
        <form name="depositForm" autoComplete="off">
            <div className="cash-display bg-primary ">
                <div className="row mx-5 pt-5">
                    <div className="span fs-4 text-white">
                        Deposit Amount (SGD)
                    </div>
                </div>
                <div className="row mx-5 my-4">
                    <div className="col-1"></div>
                    <div className="col-8">
                        <div className="input-group">
                            <span className="topup-font fw-bold input-group-text bg-primary text-white border-0">
                                $
                            </span>
                            <input
                                type="text"
                                className="topup-input form-control-lg border-0 bg-primary fw-bold text-white p-0 m-0"
                                aria-label="Top Up Amount"
                                autoComplete="false"
                                style={{
                                    width: "9em",
                                    fontSize: "4em",
                                }}
                                maxLength={9}
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="col-3">
                        <span className="topup-font fw-bold text-white h-100 d-md-block pt-3">
                            SGD
                        </span>
                    </div>
                </div>
            </div>
            <div className="row text-center p-1 ">
                <span className="text-secondary ">
                    <em>
                        *Please keep sufficient funds in your bank account to
                        avoid rejection or overdraft
                    </em>
                </span>
            </div>
            <div className="row p-5">
                <div className="d-grid gap-2 col-6 mx-auto ">
                    <button
                        type="submit"
                        className="btn btn-outline-primary pushable "
                    >
                        <span className="front">Deposit</span>
                    </button>
                </div>
            </div>
        </form>
    )
}
