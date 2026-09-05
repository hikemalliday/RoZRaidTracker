import { useRaidAttendanceApprovalList } from '../hooks/requests.js';
import { ApprovalPendingListTable } from '../components/ApprovalPendingListTable.jsx';
import { useAuthContext } from '../context/AuthContext.jsx';

export function ApprovalPendingListView() {
    const { isSuperUser } = useAuthContext();
    const { isPending, data, error } = useRaidAttendanceApprovalList({ is_approved: false });

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;
    if (data.length === 0) return <>No raids to approve.</>;
    if (!isSuperUser) return <>Unauthorized.</>;
    return <ApprovalPendingListTable data={data} />;
}
