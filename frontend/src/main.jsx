import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {NavBar} from "./components/NavBar.jsx";
import {BrowserRouter} from "react-router";
import {AuthProvider} from "./context/AuthContext.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <NavBar/>
                <App/>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
)
