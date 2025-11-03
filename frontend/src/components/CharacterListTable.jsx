import {getCell, getLinkCell, TableList} from "./Tables.jsx";

export function CharacterListTable({ data }) {
    const _getCharStatus = (char) => {
        if (char.is_main) return "Main";
        if (char.is_main_alt) return "Main Alt";
        return "Alt";
    }

    const getCharacterCells = (sorted) => {
        return sorted.map((row) => {
            return [
                getCell(row?.name),
                getCell(row?.char_class),
                getCell(_getCharStatus(row)),
                getLinkCell(row?.player.name, `/player/${row?.player?.id}`),
            ]
        })
    };

    // Null vals here means cols are not sortable
    const headerMap = {
        "Name": null,
        "Class": null,
        "Status": null,
        "Player": null,
    }

    return <TableList data={data} getTableCells={getCharacterCells} headerMap={headerMap} />
}
