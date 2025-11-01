import {usePlayerList} from "../hooks/requests.js";
import {Link} from "react-router";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {getCell, getLinkCell, TableList} from "../components/Tables.jsx";


export function PlayerListView() {
    const {data, isPending, error} = usePlayerList();

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;

    const getPlayerCells = (data) => {
        return data.map((row) => {
            const main = row.characters.find((char) => char.is_main === true);
            const alt = row.characters.find((char) => char.is_main_alt === true);
            return [
                getLinkCell(row?.name, `/player/${row?.id}`),
                getLinkCell(main?.name, `/character/${main?.id}`, {
                    "text": ` - ${main?.char_class}`,
                    "id": "char-class-span"
                }),
                getLinkCell(alt?.name, `/character/${alt?.id}`, {
                    "text": alt ? ` - ${alt?.char_class}`: "",
                    "id": "char-class-span"
                }),
                getCell(`${row?.lifetime_ra}%`),
            ]
        });
    };

    return <TableList reducedData={getPlayerCells(data)} headers={["Name", "Main", "Alt", "Lifetime RA"]}/>
}
