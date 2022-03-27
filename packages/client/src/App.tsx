import { Route, Routes } from "react-router-dom"
import CashPage from "./CashPage"
import Navbar from "./components/Navbar"
import HistoryPage from "./HistoryPage"
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
            <Route
                path="/cash"
                element={
                    <>
                        <Navbar />
                        <CashPage />
                    </>
                }
            />
            <Route
                path="/history"
                element={
                    <>
                        <Navbar />
                        <HistoryPage />
                    </>
                }
            />
        </Routes>
    )
}

export default App
