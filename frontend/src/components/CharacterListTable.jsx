import {getCell, getLinkCell, TableList} from "./Tables.jsx";
import {TableRow} from "@mui/material";

export function CharacterListTable({ data }) {
    const _getCharStatus = (char) => {
        if (char.is_main) return "Main";
        if (char.is_main_alt) return "Main Alt";
        return "Alt";
    }

    const getCharacterRows = (sorted) => {
        return sorted.map((row, i) => {
            return (
                <TableRow key={i}>
                    {getCell(row?.name)}
                    {getCell(row?.char_class)}
                    {getCell(_getCharStatus(row))}
                    {getLinkCell(row?.player.name, `/player/${row?.player?.id}`)}
                </TableRow>
            )
        })
    };

    // Null vals here means cols are not sortable
    const headerMap = {
        "Name": null,
        "Class": null,
        "Status": null,
        "Player": null,
    }

    return <TableList data={data} getTableRows={getCharacterRows} headerMap={headerMap} />
}
