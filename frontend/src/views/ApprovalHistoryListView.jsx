import { useRaidAttendanceApprovalList } from '../hooks/requests.js';
import { ApprovalHistoryListTable } from '../components/ApprovalHistoryListTable.jsx';
import { useAuthContext } from '../context/AuthContext.jsx';

// TODO: Shows list view of approved raids. Since the table RaidAttendanceApproval is not related to Raid, the best
// TODO: we could really do here is show a detail view on these links for this row, which would not show items and such
// TODO: Therefore, since its not really that much data, we will leave this list view as ready only for now, until we decide otherwise.
export function ApprovalHistoryListView() {
    const { isSuperUser } = useAuthContext();
    const { isPending, data, error } = useRaidAttendanceApprovalList({ is_approved: true });

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;
    if (data.length === 0) return <>No raids to approve.</>;
    if (!isSuperUser) return <>Unauthorized.</>;

    const sortDataById = results => {
        return results.sort((a, b) => {
            const valA = a.id;
            const valB = b.id;
            return valB - valA;
        });
    };

    return <ApprovalHistoryListTable data={sortDataById(data)} />;
}
