import { Navigate, Outlet } from "react-router";
import { useAuth } from "./context/AuthContext.jsx";


export const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Outlet/> : <Navigate to="/login" replace/>;
};