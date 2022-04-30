import GoogleAuth from "./GoogleAuth"
import AboutUs from "./AboutUs"
import { useContext } from "react"
import { AuthUserContext } from "../../authContext"
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
                            Swap, earn, and build on the leading decentralized
                            crypto trading protocol
                        </h3>
                        <div className="row text-dark mb-3">
                            <div className="col-1">
                                <i className="bi bi-twitter"></i>
                            </div>
                            <div className="col-1">
                                <i className="bi bi-twitch"></i>
                            </div>
                            <div className="col-1">
                                <i className="bi bi-facebook"></i>
                            </div>
                            <div className="col-1">
                                <i className="bi bi-reddit"></i>
                            </div>
                            <div className="col-8"></div>
                        </div>
                        <div className="row">
                            <p className="tw-light text-muted pb-3">
                                Welcome back! Please login to your account.
                            </p>
                        </div>
                        <div className="row">
                            <GoogleAuth></GoogleAuth>
                        </div>
                        <div
                            className="row text-muted align-items-end"
                            style={{ height: 200 }}
                        >
                            <div className="col text-center">
                                Create by Ding Ming & Chen Yixun
                            </div>
                        </div>
                        <div className="row text-muted ">
                            <div className="col text-center">-- IT5007 --</div>
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
