import { ListView } from "./generic/ListView.jsx";
import { RAID_ATTENDANCE_LIST } from "../tests/mocks/mockData.js";

export function RaidAttendanceListView() {
    return <ListView title="Raid Attendance" accessor="name" data={RAID_ATTENDANCE_LIST}/>
}
