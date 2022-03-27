import { User } from "firebase/auth"
import { useEffect, useState } from "react"
import { Route, Routes } from "react-router-dom"
import { AuthUserContext } from "./authContext"
import CashPage from "./CashPage"
import Navbar from "./components/Navbar"
import RequireAuth from "./components/RequireAuth"
import HistoryPage from "./HistoryPage"
import LoginPage from "./LoginPage"
import TradePage from "./TradePage"
import WalletPage from "./WalletPage"

function App() {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        if (user != null) {
            console.log(`Already has a logged in user: ${user}`)
            return
        }

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
                    path="/cash"
                    element={
                        <RequireAuth>
                            <Navbar />
                            <CashPage />
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
