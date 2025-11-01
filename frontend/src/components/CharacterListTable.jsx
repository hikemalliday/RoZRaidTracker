import {getCell, getLinkCell, TableList} from "./Tables.jsx";

export function CharacterListTable({ data }) {
    const _getCharStatus = (char) => {
        if (char.is_main) return "Main";
        if (char.is_main_alt) return "Main Alt";
        return "Alt";
    }

    const getCharacterCells = (data) => {
        return data.map((row) => {
            return [
                getCell(row?.name),
                getCell(row?.char_class),
                getCell(_getCharStatus(row)),
                getLinkCell(row?.player.name, `/player/${row?.player?.id}`),
            ]
        })
    };
    const characterHeaders = ["Name", "Class", "Status", "Player"];
    return <TableList headers={characterHeaders} reducedData={getCharacterCells(data)}/>
}
