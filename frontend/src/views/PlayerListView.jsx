import {usePlayerList} from "../hooks/requests.js";
import {Link} from "react-router";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";


export function PlayerListView() {
    const {data, isPending, error} = usePlayerList("/players/");

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;

    const getPlayersRows = (playersData) => {
        return playersData.map((player) => {
            return {
                "name": player.name,
                "id": player.id,
                "main": player.characters.find((char) => char.is_main === true),
                "mainAlt": player.characters.find((char) => char.is_main_alt === true),
            }
        })
    }

    // # TODO: Move to a 'tables' file?
    const table = (rows) => {
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell id="table-header">Name</TableCell>
                        <TableCell id="table-header">Main</TableCell>
                        <TableCell id="table-header">Alt</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => {
                        return (
                            <TableRow>
                                <TableCell id="clickable-cell">
                                    <Link to={`/player/${row?.id}`}>
                                        {row?.name || "null"}
                                    </Link>
                                </TableCell>
                                <TableCell id="clickable-cell">
                                    <Link to={`/character/${row?.main?.id}`}>
                                        {row?.main?.name || "null"}
                                    </Link>
                                    <span id="char-class-span"> - {row?.main?.char_class}</span></TableCell>
                                <TableCell id="clickable-cell">
                                    <Link to={`/character/${row?.mainAlt?.id}`}>
                                        {row?.mainAlt?.name || "null"}
                                    </Link>
                                    <span id="char-class-span"> - {row?.mainAlt?.char_class}</span></TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        )
    }
    return table(getPlayersRows(data));
}
