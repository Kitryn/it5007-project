import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import LoginPage from "./LoginPage"

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
        </Routes>
    )
}

export default App
