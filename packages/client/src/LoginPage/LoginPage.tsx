import styles from "./LoginPage.module.css"
import GoogleAuth from "./GoogleAuth"
import AboutUs from "./AboutUs"
import { useContext } from "react"
import { AuthUserContext } from "../authContext"
import { Navigate } from "react-router-dom"

const LoginPage = () => {
    const { user } = useContext(AuthUserContext) ?? {}
    if (user) {
        console.log(`User ${user} already logged in`)
        return <Navigate to="/wallet" replace={true} />
    }

    return (
        <div className="styles.container">
            <div className="card my-5 ">
                <div className="row">
                    <div className="col-6 p-5 text-primary">
                        <nav className="navbar  pb-5">
                            <a href="#" className="navbar-brand">
                                <h4 className="fw-bold">MazoSoba</h4>
                            </a>
                        </nav>
                        <h3 className="fw-bold">
                            Lorem ipsum dolor, sit amet consectetur adipisicing
                            elit.
                        </h3>
                        <p className="tw-light text-muted">
                            Welcome back! Please login to your account.
                        </p>
                        <GoogleAuth></GoogleAuth>
                        <div className="text-center text-muted py-1">
                            - Or -
                        </div>
                        <div className="d-grid">
                            <button className="btn btn-primary" type="button">
                                Continue as Guest
                            </button>
                        </div>
                    </div>
                    <div className="col-6 bg-dark text-white p-0">
                        <AboutUs />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
