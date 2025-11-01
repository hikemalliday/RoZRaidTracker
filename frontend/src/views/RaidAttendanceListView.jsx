import {useRaidAttendanceList} from "../hooks/requests.js";
import {RaidAttendanceListTable} from "../components/RaidAttendanceListTable.js";

export function RaidAttendanceListView() {
    const {data: raData, isPending, error} = useRaidAttendanceList();

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>

    return <RaidAttendanceListTable data={raData}/>
}
