import { NavLink } from "react-router-dom"
import GoogleSignOut from "./GoogleSignOut"
import { useContext } from "react"
import { AuthUserContext } from "../../authContext"

export default function Navbar() {
    const { user, setUser } = useContext(AuthUserContext) ?? {
        user: null,
        setUser: () =>
            console.error(
                `GoogleAuth: Attempt to use user context before initialisation`
            ),
    }

    return (
        <>
            <nav
                className="navbar navbar-expand-lg navbar-light  p-4 mb-5"
                style={{ backgroundColor: "rgb(241, 245, 254)" }}
            >
                <div className="container-fluid">
                    <NavLink
                        to="/"
                        className={(isActive) =>
                            "navbar-brand" + (isActive ? " active" : "")
                        }
                    >
                        <h4 className="fw-bold text-primary">MazeSoba</h4>
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
                    <div
                        className="collapse navbar-collapse"
                        id="navbarContent"
                    >
                        <div className="navbar-nav  me-auto ">
                            <NavLink
                                className="nav-item nav-link mx-4"
                                to="/wallet"
                            >
                                Wallet
                            </NavLink>
                            <NavLink
                                className="nav-item nav-link mx-4"
                                to="/trade"
                            >
                                Trade
                            </NavLink>
                            <NavLink
                                className="nav-item nav-link mx-4"
                                to="/cash"
                            >
                                Cash
                            </NavLink>
                            <NavLink
                                className="nav-item nav-link mx-4"
                                to="/history"
                            >
                                History
                            </NavLink>
                        </div>
                        <div className="ms-auto d-flex">
                            <div
                                style={{ height: "45px", width: "45px" }}
                                className="border bg-white rounded-circle me-2"
                            >
                                <img
                                    src={user?.photoURL ?? undefined}
                                    className="img-fluid rounded-circle border"
                                    // alt="Avater Icon"
                                />
                            </div>
                            <div className="col" style={{ fontSize: "12px" }}>
                                <div className="">
                                    Welcome {user?.displayName ?? ""} !
                                </div>
                                <GoogleSignOut
                                    className="btn btn-link"
                                    setUser={setUser}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}
