import Home from './views/Home.jsx';
import {Route, Routes} from "react-router";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Login from "./views/Login.jsx";
import {ProtectedRoute} from "./ProtectedRoute";
import {NotFound} from "./NotFound.jsx";
import {PlayerListView} from "./views/PlayerListView.jsx";
import {RaidListView} from "./views/RaidListView.jsx";
import {ItemAwardedListView} from "./views/itemAwardedListView.jsx";
import {RaidAttendanceListView} from "./views/RaidAttendanceListView.jsx";
import {PlayerDetailView} from "./views/PlayerDetailView.jsx";
import {ItemAwardedDetailView} from "./views/ItemAwardedDetailView.jsx";
import {RaidAttendanceDetailView} from "./views/RaidAttendanceDetailView.jsx";
import {RaidDetailView} from "./views/RaidDetailView.jsx";
import {CharacterDetailView} from "./views/CharacterDetailView.jsx";
import {ApiKeyTestView} from "./views/ApiKeyTestView.jsx";
import {ApprovalListView} from "./views/ApprovalListView.jsx";
import {ApprovalDetailView} from "./views/ApprovalDetailView.jsx";

function App() {
    const queryClient = new QueryClient();

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route element={<ProtectedRoute/>}>
                        <Route path="/" element={<Home/>}/>
                        */ List Views */
                        <Route path="/player" element={<PlayerListView/>}/>
                        <Route path="/raid" element={<RaidListView/>}/>
                        <Route path="/item_awarded" element={<ItemAwardedListView/>}/>
                        <Route path="/raid_attendance" element={<RaidAttendanceListView/>}/>
                        <Route path="/ra_approval" element={<ApprovalListView/>}/>
                        */ Detail Views */
                        <Route path="/player/:id" element={<PlayerDetailView/>}/>
                        <Route path="/raid/:id" element={<RaidDetailView/>}/>
                        <Route path="/item_awarded/:id" element={<ItemAwardedDetailView/>}/>
                        <Route path="/raid_attendance/:id" element={<RaidAttendanceDetailView/>}/>
                        <Route path="/character/:id" element={<CharacterDetailView/>}/>
                        <Route path="/ra_approval/:id" element={<ApprovalDetailView/>}/>
                    </Route>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </QueryClientProvider>
        </>
    )
}

export default App
