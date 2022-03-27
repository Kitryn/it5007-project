import { NavLink } from "react-router-dom"

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <NavLink
                    to="/"
                    className={(isActive) =>
                        "navbar-brand" + (isActive ? " active" : "")
                    }
                >
                    <h4 className="fw-bold">MazeSoba</h4>
                </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarContent">
                    <div className="navbar-nav">
                        <NavLink
                            className={(isActive) =>
                                "nav-item nav-link" +
                                (isActive ? " active" : "")
                            }
                            to="/wallet"
                        >
                            Wallet
                        </NavLink>
                        <NavLink
                            className={(isActive) =>
                                "nav-item nav-link" +
                                (isActive ? " active" : "")
                            }
                            to="/trade"
                        >
                            Trade
                        </NavLink>
                        <NavLink
                            className={(isActive) =>
                                "nav-item nav-link" +
                                (isActive ? " active" : "")
                            }
                            to="/cash"
                        >
                            Cash
                        </NavLink>
                        <NavLink
                            className={(isActive) =>
                                "nav-item nav-link" +
                                (isActive ? " active" : "")
                            }
                            to="/history"
                        >
                            History
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>
    )
}
