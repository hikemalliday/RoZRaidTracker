import {getCell, getLinkCell, TableList} from "./Tables.jsx";


export function PlayerListTable({ data }) {
    const getPlayerCells = (sorted) => {
        return sorted.map((row) => {
            const main = row.characters.find((char) => char.is_main === true);
            const alt = row.characters.find((char) => char.is_main_alt === true);
            return [
                getLinkCell(row?.name, `/player/${row?.id}`),
                getLinkCell(main?.name, `/character/${main?.id}`, {
                    "text": main ? ` - ${main?.char_class}`: "",
                    "id": "char-class-span"
                }),
                getLinkCell(alt?.name, `/character/${alt?.id}`, {
                    "text": alt ? ` - ${alt?.char_class}`: "",
                    "id": "char-class-span"
                }),
                getCell(`${row?.lifetime_ra}%`),
            ]
        });
    }

    return <TableList
        data={data}
        getTableCells={getPlayerCells}
        headerMap={{
            "Name": "name",
            "Main": null,
            "Alt": null,
            "Lifetime RA": "lifetime_ra",
        }}
    />
}