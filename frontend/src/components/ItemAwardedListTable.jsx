import {getCell, getItemIconCell, getLinkCell, TableList} from "./Tables.jsx";
import {TableRow} from "@mui/material";

export function ItemAwardedListTable({data}) {
    const getItemAwardedRows = (data) => {
        return data.map((row, i) => {
            return (
                <TableRow key={i}>
                    {getItemIconCell(row?.item?.icon_id)}
                    {getCell(row?.item?.name)}
                    {getLinkCell(row?.player?.name, `/player/${row?.player?.id}`)}
                    {getLinkCell(row?.raid?.name, `/raid/${row?.raid?.id}`)}
                    {getCell(row?.raid?.created_at)}
                </TableRow>
            )
        });
    };

    // Null vals means col is not sortable
    const headerMap = {
        "": null,
        "Name": "item.name",
        "Player": "player.name",
        "Raid": "raid.name",
        "Date": "raid.created_at",
    }
    return <TableList headerMap={headerMap} data={data} getTableRows={getItemAwardedRows}/>
}