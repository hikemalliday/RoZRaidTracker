import { useAxios } from './useAxios.jsx';
import { BACKEND_BASE_URL_DEV } from '../config.js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useMessage } from '../context/MessageContext.jsx';
import { useNavigate } from 'react-router';

// GET LIST
export function usePlayerList(queryParams) {
    const client = useAxios(BACKEND_BASE_URL_DEV);
    const { isPending, error, data } = useQuery({
        queryKey: ['players', queryParams],
        queryFn: async () => {
            const { data } = await client.get('/players/', {
                params: {
                    sort_by: queryParams?.sortBy || '',
                    page: queryParams?.page || 1,
                    order: queryParams?.order || null,
                },
            });
            return data;
        },
    });
    return { isPending, error, data };
}

export function useRaidList(queryParams) {
    const client = useAxios(BACKEND_BASE_URL_DEV);
    const { isPending, error, data } = useQuery({
        queryKey: ['raids', queryParams],
        queryFn: async () => {
            const { data } = await client.get('/raids/', {
                params: {
                    sort_by: queryParams?.sortBy || '',
                    page: queryParams?.page || 1,
                    order: queryParams?.order || null,
                },
            });
            return data;
        },
    });
    return { isPending, error, data };
}

export function useRaidAttendanceList(queryParams) {
    const client = useAxios(BACKEND_BASE_URL_DEV);
    const { isPending, error, data } = useQuery({
        queryKey: ['raid_attendance', queryParams],
        queryFn: async () => {
            const { data } = await client.get('/raid_attendance/', {
                params: queryParams,
            });
            return data;
        },
    });
    return { isPending, error, data };
}

export function useItemAwardedList(queryParams) {
    const client = useAxios(BACKEND_BASE_URL_DEV);
    const { isPending, error, data } = useQuery({
        queryKey: ['items_awarded', queryParams],
        queryFn: async () => {
            const { data } = await client.get('/items_awarded/', {
                params: {
                    sort_by: queryParams?.sortBy || '',
                    page: queryParams?.page || 1,
                    order: queryParams?.order || null,
                },
            });
            return data;
        },
    });
    return { isPending, error, data };
}

export function useCharacterList(queryParams) {
    const client = useAxios(BACKEND_BASE_URL_DEV);
    const { isPending, error, data } = useQuery({
        queryKey: ['characters', queryParams],
        queryFn: async () => {
            const { data } = await client.get(`/characters/`, {
                params: queryParams,
            });
            return data;
        },
    });
    return { isPending, error, data };
}

// GET DETAIL
export function usePlayer(id) {
    const client = useAxios(BACKEND_BASE_URL_DEV);
    const { isPending, error, data } = useQuery({
        queryKey: ['player', id],
        queryFn: async () => {
            const { data } = await client.get(`/players/${id}/`);
            return data;
        },
    });
    return { isPending, error, data };
}

export function useRaid(id) {
    const client = useAxios(BACKEND_BASE_URL_DEV);
    const { isPending, error, data } = useQuery({
        queryKey: ['raid', id],
        queryFn: async () => {
            const { data } = await client.get(`/raids/${id}/`);
            return data;
        },
    });
    return { isPending, error, data };
}

export function useRaidAttendance(id) {
    const client = useAxios(BACKEND_BASE_URL_DEV);
    const { isPending, error, data } = useQuery({
        queryKey: ['raid_attendance', id],
        queryFn: async () => {
            const { data } = await client.get(`/raid_attendance/${id}/`);
            return data;
        },
    });
    return { isPending, error, data };
}

export function useItemAwarded(id) {
    const client = useAxios(BACKEND_BASE_URL_DEV);
    const { isPending, error, data } = useQuery({
        queryKey: ['items_awarded', id],
        queryFn: async () => {
            const { data } = await client.get(`/items_awarded/${id}/`);
            return data;
        },
    });
    return { isPending, error, data };
}

export function useCharacter(id) {
    const client = useAxios(BACKEND_BASE_URL_DEV);
    const { isPending, error, data } = useQuery({
        queryKey: ['characters', id],
        queryFn: async () => {
            const { data } = await client.get(`/characters/${id}/`);
            return data;
        },
    });
    return { isPending, error, data };
}

export function useRaidAttendanceApprovalList(queryParams) {
    const axiosInstance = axios.create({ baseURL: BACKEND_BASE_URL_DEV });
    const { isPending, error, data } = useQuery({
        queryKey: ['raid_attendance_approval', queryParams],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/raid_attendance_approval/`, {
                params: queryParams,
                headers: {
                    Authorization: `Api-Key qaE6Pe7n.rO3qVVUxyop5b8wNbTOQCAXBhqJQrAau`,
                },
            });
            return data;
        },
    });
    return { isPending, error, data };
}

export function useRaidAttendanceApproval(id) {
    const client = useAxios(BACKEND_BASE_URL_DEV);
    const { isPending, error, data } = useQuery({
        queryKey: ['raid_attendance_approval', id],
        queryFn: async () => {
            const { data } = await client.get(`/raid_attendance_approval/${id}/`);
            return data;
        },
    });
    return { isPending, error, data };
}

export function useRaidAttendanceApprovalMutation(id) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { addMessage } = useMessage();
    const client = useAxios(BACKEND_BASE_URL_DEV);
    return useMutation({
        mutationFn: async ({ payload }) => {
            const { data } = await client.post(`/raid_attendance_approval/${id}/approve/`, payload);
            return data;
        },
        onSuccess: async _ => {
            addMessage('Successfully approved raid.');
            await queryClient.refetchQueries(['raid_attendance_approval']);
            navigate('/ra_approval/');
        },
        onError: error => {
            addMessage(`Failed to fetch player data: ${error.message}`, 'error');
        },
    });
}
