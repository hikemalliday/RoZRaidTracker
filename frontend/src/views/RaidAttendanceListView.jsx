import {ListView} from "./generic/ListView.jsx";
import {useRaidAttendance} from "../hooks/requests.js";

export function RaidAttendanceListView() {
    const {data, isPending, error} = useRaidAttendance("/raid_attendance/");

    if (isPending) return <>LOADING...</>;

    if (error) return <>{error.message}</>

    return <ListView title="Raid Attendance" accessor="name" data={data}/>
}
