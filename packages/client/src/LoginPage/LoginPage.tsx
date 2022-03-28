import GoogleAuth from "./GoogleAuth"
import AboutUs from "./AboutUs"
import { useContext } from "react"
import { AuthUserContext } from "../authContext"
import { Navigate } from "react-router-dom"

const LoginPage = () => {
    const { user } = useContext(AuthUserContext) ?? {}
    if (user) {
        console.log(`User ${user.email} already logged in`)
        return <Navigate to="/wallet" replace={true} />
    }

    return (
        <div className="container">
            <div className="card my-5 " style={{ height: "800px" }}>
                <div className="row" style={{ height: "100%" }}>
                    <div className="col-6 p-5 text-primary ">
                        <nav className="navbar  pb-5">
                            <a href="#" className="navbar-brand">
                                <h4 className="fw-bold">MazoSoba</h4>
                            </a>
                        </nav>
                        <div className="pb-5"></div>
                        <div className="pb-5"></div>
                        <h3 className="fw-bold">
                            Lorem ipsum dolor, sit amet consectetur adipisicing
                            elit.
                        </h3>
                        <p className="tw-light text-muted pb-3">
                            Welcome back! Please login to your account.
                        </p>
                        <GoogleAuth></GoogleAuth>
                        <div className="text-center text-muted py-3">
                            - Or -
                        </div>
                        <div className="d-grid">
                            <button
                                className="btn btn-primary fs-5"
                                type="button"
                            >
                                Continue as Guest
                            </button>{" "}
                            {/* // TODO: navigate to market board only */}
                        </div>
                    </div>
                    <div
                        className="col-6 bg-grey text-white d-flex align-items-center"
                        style={{ backgroundColor: "rgb(241, 245, 254)" }}
                    >
                        <img
                            src={require("./homeimage.png")}
                            alt="BitCoin Image"
                            className="img-fluid"
                        />
                        {/* <AboutUs /> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
