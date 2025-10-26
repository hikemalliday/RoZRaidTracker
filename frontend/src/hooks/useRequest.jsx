import {useEffect, useState} from "react";
import {useAxios} from "./useAxios.jsx";
import {BACKEND_BASE_URL_DEV} from "../config.js";


export function useRequest(uri, method = "GET", payload = {}, enabled = true) {
    const client = useAxios(BACKEND_BASE_URL_DEV);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const methodMap = {
        GET: client.get,
        POST: client.post,
        PUT: client.put,
        PATCH: client.patch,
        DELETE: client.delete,
    };

    useEffect(() => {
        const makeRequest = async () => {
            setIsLoading(true);
            const requestMethod = methodMap[method];
            try {
                const {data} = await requestMethod(uri, payload);
                setData(data);
                setIsLoading(false);
            } catch (err) {
                console.error(err);
                setError(err);
            }
        }
        void makeRequest();
    }, []);

    return {data, isLoading, error};
}