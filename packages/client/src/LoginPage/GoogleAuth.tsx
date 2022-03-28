import { useContext } from "react"
import { AuthUserContext } from "../authContext"
import { signInWithGoogle } from "../firebase"

export default function GoogleAuth() {
    const { user, setUser } = useContext(AuthUserContext) ?? {
        user: null,
        setUser: () =>
            console.error(
                `GoogleAuth: Attempt to use user context before initialisation`
            ),
    }

    const signInAndSetState = async () => {
        const user = await signInWithGoogle()
        setUser(user) // this is kinda sketch, maybe take this and put into App.tsx?
        // console.dir(user)
        localStorage.setItem("user", JSON.stringify(user))
    }

    return (
        <div className="d-grid">
            <button
                className="btn btn-outline-dark fs-5 "
                onClick={() => signInAndSetState()}
            >
                <img
                    className="me-3 img-fluid"
                    width={25}
                    alt="Google sign-in"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                />
                <span className="align-middle">Login With Google</span>
            </button>
        </div>
    )
}
