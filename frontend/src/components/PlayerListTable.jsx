import {getCell, getLinkCell, TableList} from "./Tables.jsx";
import {TableRow} from "@mui/material";


export function PlayerListTable({ data }) {
    const getPlayerRows = (sorted) => {
        return sorted.map((row, i) => {
            const main = row.characters.find((char) => char.is_main === true);
            const alt = row.characters.find((char) => char.is_main_alt === true);
            return (
                <TableRow key={i}>
                    {getLinkCell(row?.name, `/player/${row?.id}`)}
                    {getLinkCell(main?.name, `/character/${main?.id}`, {
                        "text": main ? ` - ${main?.char_class}`: "",
                        "id": "char-class-span"
                    })}
                    {getLinkCell(alt?.name, `/character/${alt?.id}`, {
                        "text": alt ? ` - ${alt?.char_class}`: "",
                        "id": "char-class-span"
                    })}
                    {getCell(`${row?.lifetime_ra}%`)}
                </TableRow>
            )
        });
    }

    const headerMap = {
        "Name": "name",
        "Main": null,
        "Alt": null,
        "Lifetime RA": "lifetime_ra",
    }

    return <TableList
        data={data}
        getTableRows={getPlayerRows}
        headerMap={headerMap}
    />
}