import { signInWithGoogle } from "../firebase"

export default function GoogleAuth() {
    return (
        <div className="py-3 border">
            <button className="button" onClick={() => signInWithGoogle()}>
                GoogleAuth PlaceHolder
            </button>
        </div>
    )
}
