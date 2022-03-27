import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import LoginPage from "./LoginPage"
import WalletPage from "./WalletPage"

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
                path="/wallet"
                element={
                    <>
                        <Navbar />
                        <WalletPage />
                    </>
                }
            />
        </Routes>
    )
}

export default App
