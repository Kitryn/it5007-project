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
                        className={({ isActive }) =>
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
                            <>
                                {[
                                    "wallet",
                                    "trade",
                                    "liquidity",
                                    "cash",
                                    "history",
                                ].map((category) => {
                                    return (
                                        <NavLink
                                            key={category}
                                            className={({ isActive }) =>
                                                "nav-item nav-link mx-4 " +
                                                (isActive
                                                    ? " border-bottom  border-primary border-2"
                                                    : "")
                                            }
                                            to={"/" + category}
                                        >
                                            {category.charAt(0).toUpperCase() +
                                                category.slice(1)}
                                        </NavLink>
                                    )
                                })}
                            </>
                        </div>
                        <div className="ms-auto d-flex">
                            <div className="row">
                                <div className="col p-0 fs-5 text-primary me-3">
                                    {(user?.displayName ?? "")
                                        .split(" ")
                                        .at(-1)}
                                </div>
                                <div className="col text-danger fs-5">
                                    <GoogleSignOut
                                        className="btn btn-link"
                                        setUser={setUser}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}
