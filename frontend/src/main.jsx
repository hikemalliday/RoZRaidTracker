import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Routes, Route} from "react-router";
import './index.css'
import App from './App.jsx'
import Login from './views/Login.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <StrictMode>
            <Routes>
                <Route path="/" element={<App />}/>
                <Route path="/login" element={<Login/>}/>
            </Routes>
        </StrictMode>
    </BrowserRouter>
)
