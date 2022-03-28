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
        <button
            className={className}
            type="button"
            onClick={() => signOutAndSetState()}
        >
            Sign Out
        </button>
    )
}
