import {useRaidAttendanceApprovalList} from "../hooks/requests.js";
import {ApprovalListTable} from "../components/ApprovalListTable.jsx";


export function ApprovalListView() {
    const {isPending, data, error} = useRaidAttendanceApprovalList();

    if (isPending) return <>LOADING...</>;

    return <ApprovalListTable data={data}/>
}