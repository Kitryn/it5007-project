import { BrowserRouter } from 'react-router-dom'
import Navbar from "./components/Navbar"
import LoginPage from './LoginPage/LoginPage';

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <LoginPage />
        </BrowserRouter>
    )
}

export default App
