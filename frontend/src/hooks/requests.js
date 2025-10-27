import {useAxios} from "./useAxios.jsx";
import {BACKEND_BASE_URL_DEV} from "../config.js";
import {useQuery} from "@tanstack/react-query";

// GET LIST
export function usePlayers() {
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


export function useRaids() {
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


export function useRaidAttendance() {
    const client = useAxios(BACKEND_BASE_URL_DEV);
    const {isPending, error, data} = useQuery({
        queryKey: ['raid_attendance'],
        queryFn: async () => {
            const {data} = await client.get("/raid_attendance/");
            return data;
        },
    })
    return {isPending, error, data};
}


export function useItemsAwarded() {
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
export function getPlayer(id) {
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


export function getRaid(id) {
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


export function getRaidAttendance(id) {
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


export function getItemAwarded(id) {
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
