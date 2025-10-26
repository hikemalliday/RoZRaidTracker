import './App.css'
import DevHome from './views/DevHome.jsx';
import {BrowserRouter, Route, Routes} from "react-router";
import Login from "./views/Login.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import {ProtectedRoute} from "./ProtectedRoute";
import {NotFound} from "./NotFound.jsx";

function App() {
    return (
        <>
            <BrowserRouter>
                <AuthProvider>
                        <Routes>
                            <Route path="/login" element={<Login/>}/>
                            <Route element={<ProtectedRoute/>}>
                                <Route path="/" element={<DevHome/>}/>
                            </Route>
                            <Route path="*" element={<NotFound/>}/>
                        </Routes>
                </AuthProvider>
            </BrowserRouter>
        </>
    )
}

export default App
