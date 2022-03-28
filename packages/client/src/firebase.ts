import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signOut,
} from "firebase/auth"
import { initializeApp } from "firebase/app"

const firebaseConfig = {
    apiKey: "AIzaSyBsZVTYn_n8Bd1ZxuMORDz8iTshv9fS_Xw",
    authDomain: "mazesoba-345315.firebaseapp.com",
    projectId: "mazesoba-345315",
    storageBucket: "mazesoba-345315.appspot.com",
    messagingSenderId: "129982544140",
    appId: "1:129982544140:web:8bab7ec81425ea30e03129",
    measurementId: "G-7K4RKM9Y0R",
}

export const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: "select_account" })

export const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider)
        const user = res.user
        return user
    } catch (err) {
        console.error(err)
        alert(err.message) // TODO: don't use alert
        return null
    }
}

export const SignOutWithGoogle = async () => {
    try {
        await signOut(auth) // logging out for testing
        console.log("signout")

        return null
    } catch (err) {
        console.error(err)
        alert(err.message) // TODO: don't use alert
        return null
    }
}
