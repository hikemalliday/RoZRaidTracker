import {useRaidAttendanceList} from "../hooks/requests.js";
import {getRaRows, getRaTable} from "./utils.jsx";

export function RaidAttendanceListView() {
    const {data: raData, isPending, error} = useRaidAttendanceList();

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>

    const raRows = getRaRows(raData);
    const raTable = getRaTable(raRows);

    return <>
        {raTable}
    </>
}
