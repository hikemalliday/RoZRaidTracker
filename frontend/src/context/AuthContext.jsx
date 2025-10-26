import {createContext, useContext, useState } from "react";
import {useNavigate} from "react-router";


const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken"));
    const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem("refreshToken"));

    const isAuthenticated = !!accessToken;

    const login = (tokens) => {
        localStorage.setItem("accessToken", tokens.access);
        localStorage.setItem("refreshToken", tokens.refresh);
        setAccessToken(tokens.access);
        setRefreshToken(tokens.refresh);
    };


    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setAccessToken(null);
        setRefreshToken(null);
        navigate("/login");
    };

    // I'm not sure that we need a useEffect here to check tokens and call refresh endpoint, let axios interceptor handle that

    return (
        <AuthContext.Provider  value={{ accessToken, refreshToken, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
