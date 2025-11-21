import { useRaidAttendanceApprovalList } from '../hooks/requests.js';
import { ApprovalListTable } from '../components/ApprovalListTable.jsx';
import { useAuthContext } from '../context/AuthContext.jsx';

export function ApprovalListView() {
    const { isSuperUser } = useAuthContext();
    const { isPending, data, error } = useRaidAttendanceApprovalList({ is_approved: false });

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;
    if (data.results.length === 0) return <>No raids to approve.</>;
    if (!isSuperUser) return <>Unauthorized.</>;
    return <ApprovalListTable data={data.results} />;
}
