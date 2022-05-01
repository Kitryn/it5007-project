import { User } from "firebase/auth"
import { useEffect, useState } from "react"
import { Route, Routes } from "react-router-dom"
import { AuthUserContext } from "./authContext"
import CashPage from "./routes/CashPage"
import Navbar from "./components/Navbar"
import RequireAuth from "./components/RequireAuth"
import HistoryPage from "./routes/HistoryPage"
import LoginPage from "./routes/LoginPage"
import TradePage from "./routes/TradePage"
import WalletPage from "./routes/WalletPage"
import LiquidityPage from "./routes/LiquidityPage"
import PositionsPage from "./routes/PositionsPage"

function App() {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        if (user != null) {
            console.log(`Already has a logged in user: ${user.email}`)
            return
        }

        // # TODO: check if the user token is still valid? when loading from localstorage
        let _localUser
        try {
            _localUser = JSON.parse(localStorage.getItem("user") ?? "")
        } catch {
            console.log(`No userdata found in local storage`)
            _localUser = null
        }
        setUser(_localUser)
    }, [user])

    return (
        <AuthUserContext.Provider value={{ user, setUser }}>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route
                    path="/wallet"
                    element={
                        <RequireAuth>
                            <Navbar />
                            <WalletPage />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/trade"
                    element={
                        <RequireAuth>
                            <Navbar />
                            <TradePage />
                        </RequireAuth>
                    }
                />

                <Route
                    path="/liquidity"
                    element={
                        <RequireAuth>
                            <Navbar />
                            <LiquidityPage />
                        </RequireAuth>
                    }
                />

                <Route
                    path="/positions"
                    element={
                        <RequireAuth>
                            <Navbar />
                            <PositionsPage />
                        </RequireAuth>
                    }
                />

                <Route
                    path="/history"
                    element={
                        <RequireAuth>
                            <Navbar />
                            <HistoryPage />
                        </RequireAuth>
                    }
                />
            </Routes>
        </AuthUserContext.Provider>
    )
}

export default App
