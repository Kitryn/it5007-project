import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import LoginPage from "./LoginPage"
import TradePage from "./TradePage"
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
            <Route
                path="/trade"
                element={
                    <>
                        <Navbar />
                        <TradePage />
                    </>
                }
            />
        </Routes>
    )
}

export default App
