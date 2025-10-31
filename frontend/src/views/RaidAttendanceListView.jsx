import {useRaidAttendanceList} from "../hooks/requests.js";
import {getCell, getLinkCell, TableList} from "../components/Tables.jsx";

export function RaidAttendanceListView() {
    const {data: raData, isPending, error} = useRaidAttendanceList();

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>

    const getRaCells = (data) => {
        return data.map((row) => {
            return [
                getLinkCell(row?.raid?.name, `/raid/${row?.raid?.id}`),
                getCell(row?.raid.zone?.name),
                getLinkCell(row?.player?.name, `/player/${row?.player?.id}`),
                getCell(row?.created_at),
            ]
        });
    }

    const headers = ["Raid", "Zone", "Player", "Date"];
    return <TableList headers={headers} reducedData={getRaCells(raData)}/>
}
