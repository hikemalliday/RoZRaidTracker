import axios from "axios";
import {useAuthContext} from "../context/AuthContext.jsx";


export const useAxios = (baseURL, enableInterceptors = true) => {
    const axiosInstance = axios.create({baseURL});
    const {accessToken, refreshToken, login, logout} = useAuthContext();

    if (!enableInterceptors) return axiosInstance;

    axiosInstance.interceptors.request.use(
        (config) => {
            if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
            return config;
        },
        (err) => Promise.reject(err)
    )

    axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        async (err) => {
            const originalRequest = err.config;
            console.log(err);
            if (err.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const refreshAxios = axios.create({ baseURL })
                    const {data} = await refreshAxios.post("/token/refresh/", {
                        refresh: refreshToken,
                    });
                    const tokens = {
                        access: data.access,
                        refresh: data.refresh,
                    };
                    login(tokens);
                    originalRequest.headers.Authorization = `Bearer ${data.access}`;
                    return axiosInstance(originalRequest);
                } catch (refreshErr) {
                    logout();
                    return Promise.reject(refreshErr);
                }
            }
            return Promise.reject(err);
        }
    )
    return axiosInstance;
};


