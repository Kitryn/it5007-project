import { BrowserRouter } from 'react-router-dom'
import Navbar from "./components/Navbar"

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <div>Hello world!</div>
        </BrowserRouter>
    )
}

export default App
