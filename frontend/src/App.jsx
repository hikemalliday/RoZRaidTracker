import './App.css'
import Home from './views/Home.jsx';
import {BrowserRouter, Route, Routes} from "react-router";
import Login from "./views/Login.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import {ProtectedRoute} from "./ProtectedRoute";
import {NotFound} from "./NotFound.jsx";
import {PlayerListView} from "./views/PlayerListView.jsx";
import {RaidListView} from "./views/RaidListView.jsx";
import {ItemAwardedListView} from "./views/itemAwardedListView.jsx";
import {RaidAttendanceListView} from "./views/RaidAttendanceListView.jsx";

function App() {
    return (
        <>
            <BrowserRouter>
                <AuthProvider>
                        <Routes>
                            <Route path="/login" element={<Login/>}/>
                            <Route element={<ProtectedRoute/>}>
                                <Route path="/" element={<Home/>}/>
                                <Route path="/players" element={<PlayerListView/>}/>
                                <Route path="/raids" element={<RaidListView/>}/>
                                <Route path="/items_awarded" element={<ItemAwardedListView/>}/>
                                <Route path="/raid_attendance" element={<RaidAttendanceListView/>}/>
                            </Route>
                            <Route path="*" element={<NotFound/>}/>
                        </Routes>
                </AuthProvider>
            </BrowserRouter>
        </>
    )
}

export default App
