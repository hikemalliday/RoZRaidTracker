import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken'));
    const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken'));
    const [isSuperUser, setIsSuperUser] = useState(false);

    const isAuthenticated = !!accessToken;

    const login = tokens => {
        localStorage.setItem('accessToken', tokens.access);
        localStorage.setItem('refreshToken', tokens.refresh);
        setAccessToken(tokens.access);
        setRefreshToken(tokens.refresh);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAccessToken(null);
        setRefreshToken(null);
        navigate('/login');
    };

    useEffect(() => {
        if (accessToken) {
            const decoded = jwtDecode(accessToken);
            setIsSuperUser(decoded.is_superuser);
        }
    }, [accessToken]);

    return (
        <AuthContext.Provider
            value={{ accessToken, refreshToken, login, logout, isAuthenticated, isSuperUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
