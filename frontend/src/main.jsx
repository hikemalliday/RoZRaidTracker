import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {NavBar} from "./components/NavBar.jsx";
import {BrowserRouter} from "react-router";
import {AuthProvider} from "./context/AuthContext.jsx";
import {MessageProvider} from "./context/MessageContext.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <MessageProvider>
                    <NavBar/>
                    <App/>
                </MessageProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
)
