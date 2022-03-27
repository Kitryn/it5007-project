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
        console.dir(user)
        localStorage.setItem("user", JSON.stringify(user))
    }

    return (
        <div className="py-3 border">
            <button className="button" onClick={() => signInAndSetState()}>
                GoogleAuth PlaceHolder
            </button>
        </div>
    )
}
