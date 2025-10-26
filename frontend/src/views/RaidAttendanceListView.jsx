import {ListView} from "./generic/ListView.jsx";
import {useRaidAttendance} from "../hooks/requests.js";

export function RaidAttendanceListView() {
    const {data, isLoading, error} = useRaidAttendance("/raid_attendance/");

    if (isLoading) return <>LOADING...</>;

    return <ListView title="Raid Attendance" accessor="name" data={data}/>
}
