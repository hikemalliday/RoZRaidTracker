import { useRequest } from "./useRequest.jsx";


export function usePlayers() {
    return useRequest("/players/");
}

export function useRaids() {
    return useRequest("/raids/");
}


export function useRaidAttendance() {
    return useRequest("/raid_attendance/");
}


export function useItemsAwarded() {
    return useRequest("/items_awarded/");
}