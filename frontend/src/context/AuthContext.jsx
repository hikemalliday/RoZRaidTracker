import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { jwtDecode } from 'jwt-decode';
import { api } from '../api.js';

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
        } else {
            setIsSuperUser(false);
        }
    }, [accessToken]);

    useEffect(() => {
        const req = api.interceptors.request.use(config => {
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        });

        const res = api.interceptors.response.use(
            res => res,
            async err => {
                const original = err.config;

                if (err.response?.status === 401 && !original._retry && refreshToken) {
                    original._retry = true;
                    try {
                        const { data } = await api.post('/token/refresh/', {
                            refresh: refreshToken,
                        });
                        login(data);
                        original.headers.Authorization = `Bearer ${data.access}`;
                        return api(original);
                    } catch {
                        // Clear tokens without redirecting - let ProtectedRoute handle redirects
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        setAccessToken(null);
                        setRefreshToken(null);
                    }
                }
                return Promise.reject(err);
            }
        );

        return () => {
            api.interceptors.request.eject(req);
            api.interceptors.response.eject(res);
        };
    }, [accessToken, refreshToken]);

    return (
        <AuthContext.Provider
            value={{ accessToken, refreshToken, login, logout, isAuthenticated, isSuperUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
