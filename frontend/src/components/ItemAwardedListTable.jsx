import {getCell, getItemIconCell, getLinkCell, TableList} from "./Tables.jsx";

export function ItemAwardedListTable({ data }) {
    const getItemAwardedCells = (data) => {
        return data.map((row) => {
            return [
                getItemIconCell(row?.item?.icon_id),
                getCell(row?.item?.name),
                getLinkCell(row?.player?.name, `/player/${row?.player?.id}`),
                getLinkCell(row?.raid?.name, `/raid/${row?.raid?.id}`),
                getCell(row?.created_at),
            ]
        });
    };
    // Blank header to handle item icon col
    const headers = ["", "Name", "Player", "Raid", "Date"];
    return <TableList headers={headers} reducedData={getItemAwardedCells(data)}/>
}