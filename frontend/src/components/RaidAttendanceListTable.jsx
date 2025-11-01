import {getCell, getLinkCell, TableList} from "./Tables.jsx";

export function RaidAttendanceListTable({ data }) {
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
    return <TableList headers={headers} reducedData={getRaCells(data)}/>
}