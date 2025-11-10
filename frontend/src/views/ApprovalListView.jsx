import { useRaidAttendanceApprovalList } from '../hooks/requests.js';
import { ApprovalListTable } from '../components/ApprovalListTable.jsx';

export function ApprovalListView() {
    const { isPending, data, error } = useRaidAttendanceApprovalList({ is_approved: false });

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;
    if (data.results.length === 0) return <>No raids to approve.</>;
    return <ApprovalListTable data={data.results} />;
}
