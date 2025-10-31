import {ListView} from "./generic/ListView.jsx";
import {usePlayers} from "../hooks/requests.js";
import {useNavigate} from "react-router";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";

// TODO: Currently not using the generic list view here

export function PlayerListView() {
    const navigate = useNavigate();
    const {data, isPending, error} = usePlayers("/players/");

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

    const handleClick = (view, id) => {
        return navigate(`/${view}/${id}`, {replace: true});
    }

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
                            <TableCell id="clickable-cell" onClick={(_) => handleClick("players", row?.id)}>{row?.name}</TableCell>
                            <TableCell id="clickable-cell" onClick={(_) => handleClick("characters", row?.main?.id)}>{row?.main?.name || "null"}<span id="char-class-span"> - {row?.main?.char_class}</span></TableCell>
                            <TableCell id="clickable-cell" onClick={(_) => handleClick("characters", row?.mainAlt?.id)}>{row?.mainAlt?.name || "null"} <span id="char-class-span"> - {row?.mainAlt?.char_class}</span></TableCell>
                        </TableRow>
                    )
                })}
                </TableBody>
            </Table>
        )
    }
    return table(getPlayersRows(data));

    // return <ListView title="Players" accessor="name" data={data}/>
}
