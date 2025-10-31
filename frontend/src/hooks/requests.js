import {useAxios} from "./useAxios.jsx";
import {BACKEND_BASE_URL_DEV} from "../config.js";
import {useQuery} from "@tanstack/react-query";

// GET LIST
export function usePlayerList() {
    const client = useAxios(BACKEND_BASE_URL_DEV);
    const {isPending, error, data} = useQuery({
        queryKey: ['players'],
        queryFn: async () => {
            const {data} = await client.get("/players/");
            return data;
        },
    })
    return {isPending, error, data};
}


export function useRaidList() {
    const client = useAxios(BACKEND_BASE_URL_DEV);
    const {isPending, error, data} = useQuery({
        queryKey: ['raids'],
        queryFn: async () => {
            const {data} = await client.get("/raids/");
            return data;
        },
    })
    return {isPending, error, data};
}


export function useRaidAttendanceList(queryParams) {
    const client = useAxios(BACKEND_BASE_URL_DEV);
    const {isPending, error, data} = useQuery({
        queryKey: ['raid_attendance', queryParams],
        queryFn: async () => {
            const {data} = await client.get("/raid_attendance/", {
                params: queryParams,
            });
            return data;
        },
    })
    return {isPending, error, data};
}


export function useItemAwardedList() {
    const client = useAxios(BACKEND_BASE_URL_DEV);
    const {isPending, error, data} = useQuery({
        queryKey: ['items_awarded'],
        queryFn: async () => {
            const {data} = await client.get("/items_awarded/");
            return data;
        },
    })
    return {isPending, error, data};
}

// GET DETAIL
export function usePlayer(id) {
    const client = useAxios(BACKEND_BASE_URL_DEV);
    const {isPending, error, data} = useQuery({
        queryKey: ['player', id],
        queryFn: async () => {
            const {data} = await client.get(`/players/${id}/`);
            return data;
        }
    });
    return {isPending, error, data};
}


export function useRaid(id) {
    const client = useAxios(BACKEND_BASE_URL_DEV);
    const {isPending, error, data} = useQuery({
        queryKey: ['raid', id],
        queryFn: async () => {
            const {data} = await client.get(`/raids/${id}/`);
            return data;
        }
    });
    return {isPending, error, data};
}


export function useRaidAttendance(id) {
    const client = useAxios(BACKEND_BASE_URL_DEV);
    const {isPending, error, data} = useQuery({
        queryKey: ['raid_attendance', id],
        queryFn: async () => {
            const {data} = await client.get(`/raid_attendance/${id}/`);
            return data;
        }
    });
    return {isPending, error, data};
}


export function useItemAwarded(id) {
    const client = useAxios(BACKEND_BASE_URL_DEV);
    const {isPending, error, data} = useQuery({
        queryKey: ['items_awarded', id],
        queryFn: async () => {
            const {data} = await client.get(`/items_awarded/${id}/`);
            return data;
        }
    });
    return {isPending, error, data};
}


export function useCharacter(id) {
    const client = useAxios(BACKEND_BASE_URL_DEV);
    const {isPending, error, data} = useQuery({
        queryKey: ['characters', id],
        queryFn: async () => {
            const {data} = await client.get(`/characters/${id}/`);
            return data;
        }
    });
    return {isPending, error, data};
}
