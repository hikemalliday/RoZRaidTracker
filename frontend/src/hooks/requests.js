import { useAxios } from './useAxios.jsx';
import { BACKEND_BASE_URL_DEV } from '../config.js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useMessage } from '../context/MessageContext.jsx';
import { useNavigate } from 'react-router';
import { handleAscDesc } from '../views/utils.jsx';

// Means to emulate 'no pagination' for hooks that don't want it.
// Keeps data shape consistent on list responses
const PAGE_SIZE_NO_PAGINATION = 9999;

export const useList = (queryKey, route, queryParams = {}) => {
    const client = useAxios(BACKEND_BASE_URL_DEV);
    const { isPending, error, data } = useQuery({
        queryKey: [queryKey, queryParams],
        queryFn: async () => {
            const { data } = await client.get(route, {
                params: {
                    ...queryParams,
                    page_size: PAGE_SIZE_NO_PAGINATION,
                },
            });
            return data;
        },
    });
    return { isPending, error, data };
};

export const _useListPaginated = (queryKey, route, queryParams) => {
    const client = useAxios(BACKEND_BASE_URL_DEV);
    const { ordering, orderDir, page } = queryParams;
    const { isPending, error, data } = useQuery({
        queryKey: [queryKey, queryParams],
        queryFn: async () => {
            const { data } = await client.get(route, {
                params: {
                    ordering: handleAscDesc(orderDir || 'asc', ordering),
                    page,
                },
            });
            return data;
        },
    });
    return { isPending, error, data };
};

export const useDetail = (queryKey, route, id) => {
    const client = useAxios(BACKEND_BASE_URL_DEV);
    const { isPending, error, data } = useQuery({
        queryKey: [queryKey, id],
        queryFn: async () => {
            const { data } = await client.get(`${route}${id}/`);
            return data;
        },
    });
    return { isPending, error, data };
};

// GET LIST PAGINATED
export function usePlayerListPaginated(queryParams) {
    return _useListPaginated('players', '/players/', queryParams);
}

export function useRaidListPaginated(queryParams) {
    return _useListPaginated('raids', '/raids/', queryParams);
}

export function useItemAwardedListPaginated(queryParams) {
    return _useListPaginated('items_awarded', '/items_awarded/', queryParams);
}

// TODO: Generate new API key and ABSTRACT AWAY INTO CONFIG or env vars
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
