import "./style.css"

const Console = ({
    token,
    selection,
    onSelectHander,
    autoFocus,
    isStatic,
    balance,
}) => {
    return (
        <div className="row m-0 bg-primary" style={{ height: "200px" }}>
            <div className="px-5">
                <div className="row py-3">
                    <div className="col-3">
                        <div className="btn-group">
                            {!isStatic ? (
                                <>
                                    <button
                                        type="button"
                                        className="btn btn-light dropdown-toggle rounded-pill px-3 fw-bold                                "
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        {token ? token : "Select a Token"}
                                    </button>
                                    <ul className="dropdown-menu">
                                        {selection.map((option: string) => (
                                            <li key={option}>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                    onClick={(e) =>
                                                        onSelectHander(e)
                                                    }
                                                >
                                                    {option}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <>
                                    <button className="btn btn-light rounded-pill px-3 fw-bold bg-body">
                                        {token}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="row py-3 px-3">
                    <div className="col">
                        <input
                            type="text"
                            className="form-control-lg border-0 bg-primary fw-bold text-white p-0 m-0"
                            maxLength={9}
                            aria-label="Amount"
                            placeholder="0.00"
                            autoFocus={autoFocus}
                            disabled={isStatic}
                        ></input>
                    </div>
                    <div className="col-2">
                        <p className="text-white fs-4 balance">
                            <span className="">Balance: {balance}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Console
