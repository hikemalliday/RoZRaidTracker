import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "./context/AuthContext.jsx";


export const ProtectedRoute = () => {
    const { isAuthenticated } = useAuthContext();
    return isAuthenticated ? <Outlet/> : <Navigate to="/login" replace/>;
};