import {useItemAwardedList} from "../hooks/requests.js";
import {getItemAwardedRows, getItemAwardedTable} from "./utils.jsx";
import {getCell, getItemIconCell, getLinkCell, TableList} from "../components/Tables.jsx";

export function ItemAwardedListView() {
    const {data, isPending, error} = useItemAwardedList();

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;

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
