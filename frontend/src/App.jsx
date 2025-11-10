import Home from './views/Home.jsx';
import { Route, Routes } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './views/Login.jsx';
import { ProtectedRoute } from './ProtectedRoute';
import { NotFound } from './NotFound.jsx';
import { PlayerListView } from './views/PlayerListView.jsx';
import { RaidListView } from './views/RaidListView.jsx';
import { ItemAwardedListView } from './views/itemAwardedListView.jsx';
import { PlayerDetailView } from './views/PlayerDetailView.jsx';
import { RaidDetailView } from './views/RaidDetailView.jsx';
import { ApprovalListView } from './views/ApprovalListView.jsx';
import { CompareView } from './views/CompareView.jsx';
import { ApprovalDetailView } from './views/ApprovalDetailView.jsx';

function App() {
    const queryClient = new QueryClient();

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Home />} />
                        */ List Views */
                        <Route path="/player" element={<PlayerListView />} />
                        <Route path="/raid" element={<RaidListView />} />
                        <Route path="/item_awarded" element={<ItemAwardedListView />} />
                        <Route path="/ra_approval" element={<ApprovalListView />} />
                        */ Detail Views */
                        <Route path="/player/:id" element={<PlayerDetailView />} />
                        <Route path="/raid/:id" element={<RaidDetailView />} />
                        <Route path="/ra_approval/:id" element={<ApprovalDetailView />} />
                        */ MISC */
                        <Route path="/compare" element={<CompareView />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </QueryClientProvider>
        </>
    );
}

export default App;
