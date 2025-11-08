import {getCell, getLinkCell, TableList} from "./Tables.jsx";
import {TableRow} from "@mui/material";

export function RaidAttendanceListTable({ data, rowStyles = {}}) {
    const getRaRows = (data) => {
        return data.map((row, i) => {
            return (
                <TableRow key={i} sx={rowStyles}>
                    {getLinkCell(row?.player?.name, `/player/${row?.player?.id}`)}
                    {getLinkCell(row?.raid?.name, `/raid/${row?.raid?.id}`)}
                    {getCell(row?.raid.zone?.name)}
                    {getCell(row?.created_at)}
                </TableRow>
            )
        });
    }

    const headerMap = {
        "Player": "player.name",
        "Raid": "raid.name",
        "Zone": "raid.zone.name",
        "Date": "created_at",
    }
    return <TableList headerMap={headerMap} data={data} getTableRows={getRaRows}/>
}