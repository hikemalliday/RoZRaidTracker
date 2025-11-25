import { useAxios } from './useAxios.jsx';
import { BASE_URL } from '../config.js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMessage } from '../context/MessageContext.jsx';
import { useNavigate } from 'react-router';
import { handleAscDesc } from '../views/utils.jsx';

// Means to emulate 'no pagination' for hooks that don't want it.
// Keeps data shape consistent on list responses
const PAGE_SIZE_NO_PAGINATION = 9999;

export const useList = (queryKey, route, queryParams = {}) => {
    const client = useAxios(BASE_URL);
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

export const useListDebounced = (queryKey, route, filterField, filterVal) => {
    const queryParams = { [filterField]: filterVal };
    const client = useAxios(BASE_URL);
    const { isPending, error, data } = useQuery({
        queryKey: [queryKey, filterField, filterVal],
        queryFn: async () => {
            const { data } = await client.get(route, {
                params: {
                    ...queryParams,
                    page_size: PAGE_SIZE_NO_PAGINATION,
                },
            });
            return data;
        },
        enabled: filterVal.length > 3,
    });
    return { isPending, error, data };
};

export const _useListPaginated = (queryKey, route, queryParams) => {
    const client = useAxios(BASE_URL);
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
    const client = useAxios(BASE_URL);
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

// TODO: Use helper instead
export function useRaidAttendanceApprovalList(queryParams) {
    const client = useAxios(BASE_URL);
    const { isPending, error, data } = useQuery({
        queryKey: ['raid_attendance_approval', queryParams],
        queryFn: async () => {
            const { data } = await client.get(`/raid_attendance_approval/`, {
                params: queryParams,
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
    const client = useAxios(BASE_URL);
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
            const errorMessage = error?.response?.data?.error || 'Unknown error';
            addMessage(`Failed to approve raid: ${errorMessage}`, 'error');
        },
    });
}

export function useRaidAttendanceMutation() {
    const queryClient = useQueryClient();
    const { addMessage } = useMessage();
    const client = useAxios(BASE_URL);
    return useMutation({
        mutationFn: async ({ payload }) => {
            console.log(payload);
            const { data } = await client.post(`/raid_attendance/`, payload);
            return data;
        },
        onSuccess: async _ => {
            addMessage('Successfully added Raid Attendance row.');
            await queryClient.refetchQueries(['raid_attendance']);
        },
        onError: error => {
            const errorMessage = error?.response?.data?.error || 'Unknown error';
            addMessage(`Failed to add Raid Attendance row: ${errorMessage}`, 'error');
        },
    });
}

export function useRaidAttendanceDelete() {
    const queryClient = useQueryClient();
    const { addMessage } = useMessage();
    const client = useAxios(BASE_URL);
    return useMutation({
        mutationFn: async id => {
            const { data } = await client.delete(`/raid_attendance/${id}/`);
            return data;
        },
        onSuccess: async _ => {
            addMessage('Successfully removed Raid Attendance row.');
            await queryClient.refetchQueries(['raid_attendance']);
        },
        onError: error => {
            const errorMessage = error?.response?.data?.error || 'Unknown error';
            addMessage(`Failed to remove Raid Attendance row: ${errorMessage}`, 'error');
        },
    });
}
