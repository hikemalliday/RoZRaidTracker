import {getCell, getLinkCell, TableList} from "./Tables.jsx";
import {TableRow} from "@mui/material";

export function RaidAttendanceListTable({ data }) {
    const getRaRows = (data) => {
        return data.map((row, i) => {
            return (
                <TableRow key={i}>
                    {getLinkCell(row?.raid?.name, `/raid/${row?.raid?.id}`)}
                    {getCell(row?.raid.zone?.name)}
                    {getLinkCell(row?.player?.name, `/player/${row?.player?.id}`)}
                    {getCell(row?.created_at)}
                </TableRow>
            )
        });
    }

    const headerMap = {
        "Raid": "raid.name",
        "Zone": "raid.zone.name",
        "Player": "player.name",
        "Date": "created_at",
    }
    return <TableList headerMap={headerMap} data={data} getTableRows={getRaRows}/>
}