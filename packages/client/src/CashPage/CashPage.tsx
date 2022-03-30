import DepositForm from "./DepositForm"

import {
    Routes,
    Route,
    NavLink,
    useParams,
    useLocation,
} from "react-router-dom"

export default function CashPage() {
    const { pathname } = useLocation()
    console.log(pathname)

    return (
        <div className="container">
            <div className="card">
                <div className="row m-0">
                    <div className="col py-3 border-end">
                        <NavLink
                            to={`./deposit`}
                            className={({ isActive }) =>
                                "cash-btn btn btn-white w-100 fs-1  fw-bold" +
                                (isActive ? " text-dark" : "")
                            }
                        >
                            DEPOSIT
                        </NavLink>
                    </div>
                    <div className="col py-3 border-start">
                        <NavLink
                            to={`./withdraw`}
                            className={({ isActive }) =>
                                "cash-btn btn btn-white w-100 fs-1  fw-bold" +
                                (isActive ? " text-muted" : "")
                            }
                        >
                            Withdraw
                        </NavLink>
                    </div>
                </div>

                <Routes>
                    <Route path={`./deposit`} element={<DepositForm />}></Route>
                </Routes>
            </div>
        </div>
    )
}
0
