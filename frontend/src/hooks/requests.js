import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMessage } from '../context/MessageContext.jsx';
import { useNavigate } from 'react-router';
import { handleAscDesc } from '../views/utils.jsx';
import { api } from '../api.js';

// Means to emulate 'no pagination' for hooks that don't want it.
// Keeps data shape consistent on list responses
const PAGE_SIZE_NO_PAGINATION = 9999;

const _getErrStr = (error) => {
    if (!error?.response?.data) return 'Unknown Error.';
    let errStr = 'Errors: ';
    Object.entries(error?.response?.data).forEach(([key, val]) => {
         errStr += ' ';
         errStr += `${key}: `;
         errStr += `${val}`;
    });
    return errStr;
}

export const _useList = (queryKey, route, queryParams = {}) => {
    const { isPending, error, data } = useQuery({
        queryKey: [queryKey, queryParams],
        queryFn: async () => {
            const { data } = await api.get(route, {
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

export const useItemOptionsList = (queryParams = {}) => {
    return _useList('items', '/items/get_options/', queryParams);
};

export const usePlayersList = (queryParams = {}) => {
    return _useList('players', '/players/', queryParams);
};

export const useItemsAwardedList = (queryParams = {}) => {
    return _useList('items_awarded', '/items_awarded/', queryParams);
};

export const useCharactersList = (queryParams = {}) => {
    return _useList('characters', '/characters/', queryParams);
};

export const useRaidAttendanceList = (queryParams = {}) => {
    return _useList('raid_attendance', '/raid_attendance/', queryParams);
};

export const useListDebounced = (queryKey, route, filterField, filterVal) => {
    const queryParams = { [filterField]: filterVal };
    const { isPending, error, data } = useQuery({
        queryKey: [queryKey, filterField, filterVal],
        queryFn: async () => {
            const { data } = await api.get(route, {
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
    const { ordering, orderDir, page, ...rest } = queryParams;
    const { isPending, error, data } = useQuery({
        queryKey: [queryKey, queryParams],
        queryFn: async () => {
            const { data } = await api.get(route, {
                params: {
                    ordering: handleAscDesc(orderDir || 'asc', ordering),
                    page,
                    ...rest,
                },
            });
            return data;
        },
    });
    return { isPending, error, data };
};

export const _useDetail = (queryKey, route, id) => {
    const { isPending, error, data } = useQuery({
        queryKey: [queryKey, id],
        queryFn: async () => {
            const { data } = await api.get(`${route}${id}/`);
            return data;
        },
    });
    return { isPending, error, data };
};

export const useRaidAttendanceListPaginated = (queryParams = {}) => {
    return _useListPaginated('raid_attendance', '/raid_attendance/', queryParams);
};

export const useRaidAttendanceApprovalDetail = id => {
    return _useDetail('raid_attendance_approval', '/raid_attendance_approval/', id);
};

export const usePlayerDetail = id => {
    return _useDetail('players', '/players/', id);
};

export const useRaidDetail = id => {
    return _useDetail('raids', '/raids/', id);
};

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
    const { isPending, error, data } = useQuery({
        queryKey: ['raid_attendance_approval', queryParams],
        queryFn: async () => {
            const { data } = await api.get(`/raid_attendance_approval/`, {
                params: { ...queryParams, page_size: PAGE_SIZE_NO_PAGINATION },
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
    return useMutation({
        mutationFn: async ({ payload }) => {
            const { data } = await api.post(`/raid_attendance_approval/${id}/approve/`, payload);
            return data;
        },
        onSuccess: async () => {
            addMessage('Successfully approved raid.');
            await queryClient.refetchQueries(['raid_attendance_approval']);
            navigate('/ra_approval_pending/');
        },
        onError: error => {
            addMessage(`Failed to approve raid: ${_getErrStr(error)}`, 'error');
        },
    });
}

export function useRaidAttendanceMutation() {
    const queryClient = useQueryClient();
    const { addMessage } = useMessage();
    return useMutation({
        mutationFn: async ({ payload }) => {
            const { data } = await api.post(`/raid_attendance/`, payload);
            return data;
        },
        onSuccess: async () => {
            addMessage('Successfully added Raid Attendance row.');
            await queryClient.refetchQueries(['raid_attendance']);
        },
        onError: error => {
            addMessage(`Failed to add Raid Attendance row: ${_getErrStr(error)}`, 'error');
        },
    });
}

export function useRaidAttendanceDelete() {
    const queryClient = useQueryClient();
    const { addMessage } = useMessage();
    return useMutation({
        mutationFn: async id => {
            const { data } = await api.delete(`/raid_attendance/${id}/`);
            return data;
        },
        onSuccess: async () => {
            addMessage('Successfully removed Raid Attendance row.');
            await queryClient.refetchQueries(['raid_attendance']);
        },
        onError: error => {
            const errorMessage = error?.response?.data?.error || 'Unknown error';
            addMessage(`Failed to remove Raid Attendance row: ${errorMessage}`, 'error');
        },
    });
}

export function useItemAwardedCreate() {
    const queryClient = useQueryClient();
    const { addMessage } = useMessage();
    return useMutation({
        mutationFn: async ({ payload }) => {
            const { data } = await api.post(`/items_awarded/`, payload);
            return data;
        },
        onSuccess: async (data) => {
            addMessage(`Successfully created Item Awarded row. player: ${data?.player?.name}, name: ${data?.item?.name}`);
            await queryClient.refetchQueries(['item_awarded']);
        },
        onError: error => {
            addMessage(`Failed to create Item Awarded row: ${_getErrStr(error)}`, 'error');
        },
    });
}
// TODO: 12/14: Make abstraction for delete hooks
// TODO: 12/14: Rename other mutation hooks to their respective verbs
export function useItemAwardedDelete() {
    const queryClient = useQueryClient();
    const { addMessage } = useMessage();
    return useMutation({
        mutationFn: async id => {
            const { data } = await api.delete(`/items_awarded/${id}/`);
            return data;
        },
        onSuccess: async () => {
            addMessage('Successfully removed Item Awarded row.');
            await queryClient.refetchQueries(['items_awarded']);
        },
        onError: error => {
            addMessage(`Failed to remove Item Awarded row: ${_getErrStr(error)}`, 'error');
        },
    });
}

export function useCharacterCreate() {
    const queryClient = useQueryClient();
    const { addMessage } = useMessage();
    return useMutation({
        mutationFn: async ({ payload }) => {
            const { data } = await api.post(`/characters/`, payload);
            return data;
        },
        onSuccess: async (data) => {
            addMessage(`Successfully created Character row. name: ${data?.name}, class: ${data?.char_class}`);
            await queryClient.refetchQueries(['characters']);
        },
        onError: error => {
            addMessage(`Failed to create Character row: ${_getErrStr(error)}`, 'error');
        },
    });
}

export function useCharacterEdit() {
    const queryClient = useQueryClient();
    const { addMessage } = useMessage();

    return useMutation({
        mutationFn: async ({ payload }) => {
            const { data } = await api.patch(`/characters/${payload.id}/`, payload);
            return data;
        },
        onSuccess: async () => {
            addMessage('Successfully edited Character row.');
            await queryClient.refetchQueries({ queryKey: ['characters'] });
        },
        onError: error => {
            addMessage(`Failed to edit Character row: ${_getErrStr(error)}`, 'error');
        },
    });
}

export function useCharacterBatchEdit() {
    const queryClient = useQueryClient();
    const { addMessage } = useMessage();

    return useMutation({
        mutationFn: async ({ payload }) => {
            const { data } = await api.patch(`/characters/batch/`, payload);
            return data;
        },
        onSuccess: async () => {
            addMessage('Successfully edited Character rows (Batch Edit).');
            await queryClient.refetchQueries({ queryKey: ['characters'] });
        },
        onError: error => {
            addMessage(`Failed to edit Character row: ${_getErrStr(error)}`, 'error');
        },
    });
}

export function useItemAwardedEdit() {
    const queryClient = useQueryClient();
    const { addMessage } = useMessage();

    return useMutation({
        mutationFn: async ({ payload }) => {
            const { data } = await api.patch(`/items_awarded/${payload.id}/`, payload);
            return data;
        },
        onSuccess: async (data) => {
            addMessage(`Successfully edited Item Awarded row. player: ${data?.player?.name}, name: ${data?.item?.name}`);
            await queryClient.refetchQueries({ queryKey: ['items_awarded'] });
        },
        onError: error => {
            addMessage(`Failed to edit Item Awarded row: ${_getErrStr(error)}`, 'error');
        },
    });
}

export function usePlayerEdit(id) {
    const queryClient = useQueryClient();
    const { addMessage } = useMessage();

    return useMutation({
        mutationFn: async ({ payload }) => {
            const { data } = await api.patch(`/players/${id}/`, payload);
            return data;
        },
        onSuccess: async () => {
            addMessage('Successfully edited Player row.');
            await queryClient.refetchQueries({ queryKey: ['players'] });
        },
        onError: error => {
            addMessage(`Failed to edit Player row: ${_getErrStr(error)}`, 'error');
        },
    });
}

export function useRaidAttendanceApprovalDelete() {
    const queryClient = useQueryClient();
    const { addMessage } = useMessage();
    return useMutation({
        mutationFn: async id => {
            const { data } = await api.delete(`/raid_attendance_approval/${id}/`);
            return data;
        },
        onSuccess: async () => {
            addMessage('Successfully removed Raid Attendance Approval row.');
            await queryClient.refetchQueries(['raid_attendance_approval']);
        },
        onError: error => {
            const errorMessage = error?.response?.data?.error || 'Unknown error';
            addMessage(`Failed to remove Raid Attendance Approval row: ${errorMessage}`, 'error');
        },
    });
}
