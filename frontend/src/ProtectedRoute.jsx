import { Navigate, Outlet } from 'react-router';
import { useAuthContext } from './context/AuthContext.jsx';

export function ProtectedRoute({ needSuper = false }) {
    const { isAuthenticated, isSuperUser } = useAuthContext();
    const canAccess = needSuper ? isAuthenticated && isSuperUser : isAuthenticated;
    return canAccess ? <Outlet /> : <Navigate to="/login" replace />;
}
