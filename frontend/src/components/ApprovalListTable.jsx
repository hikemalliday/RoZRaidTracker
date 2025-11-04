import {TableRow} from "@mui/material";
import {getLinkCell, TableList} from "./Tables.jsx";


export function ApprovalListTable({ data }) {

    function _joinAndTruncate(playersArray) {
        return playersArray.join(", ").slice(0, 50) + "...";
    }
    const getApprovalRows = (sorted) => {
        return sorted.map((row, i) => {
            const detailRoute = `/ra_approval/${row?.id}`;
            return (
                <TableRow key={i}>
                    {getLinkCell(row?.id, detailRoute)}
                    {getLinkCell(_joinAndTruncate(row?.players_list), detailRoute)}
                    {getLinkCell(row?.created_at, detailRoute)}
                </TableRow>
            )
        });
    };

    const headerMap = {
        "ID": "id",
        "Players": "players_list",
        "Date": "created_at",
    };

    return <TableList
        data={data}
        getTableRows={getApprovalRows}
        headerMap={headerMap}
    />
}