import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import { initializeApp } from "firebase/app"
import { BrowserRouter } from "react-router-dom"

const firebaseConfig = {
    apiKey: "AIzaSyBsZVTYn_n8Bd1ZxuMORDz8iTshv9fS_Xw",
    authDomain: "mazesoba-345315.firebaseapp.com",
    projectId: "mazesoba-345315",
    storageBucket: "mazesoba-345315.appspot.com",
    messagingSenderId: "129982544140",
    appId: "1:129982544140:web:8bab7ec81425ea30e03129",
    measurementId: "G-7K4RKM9Y0R",
}

const app = initializeApp(firebaseConfig)

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
)
