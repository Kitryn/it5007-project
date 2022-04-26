import { SignOutWithGoogle } from "../../firebase"
import { useContext } from "react"
import { AuthUserContext } from "../../authContext"

export default function GoogleSignOut({ className, setUser }) {
    // const { user, setUser } = useContext(AuthUserContext) ?? {
    //     user: null,
    //     setUser: () =>
    //         console.error(
    //             `GoogleAuth: Attempt to use user context before initialisation`
    //         ),
    // }

    const signOutAndSetState = async () => {
        await SignOutWithGoogle()
        setUser(null)
        localStorage.removeItem("user")
    }

    return (
        <>
            <i
                className="bi bi-box-arrow-right pe-2"
                onClick={() => signOutAndSetState()}
                style={{ cursor: "pointer" }}
            ></i>
        </>
    )
}
