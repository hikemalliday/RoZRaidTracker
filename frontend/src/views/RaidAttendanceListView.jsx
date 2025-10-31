import {ListView} from "./generic/ListView.jsx";
import {useRaidAttendanceList} from "../hooks/requests.js";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {useNavigate} from "react-router";

export function RaidAttendanceListView() {
    const navigate = useNavigate();
    const {data, isPending, error} = useRaidAttendanceList();

    if (isPending) return <>LOADING...</>;

    if (error) return <>{error.message}</>

    const getRaRows = (raData) => {
        return raData.map((ra) => {
            return {
                "id": ra.id,
                "raid": ra.raid,
                "zone": ra.zone,
                "player": ra.player,
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
                        <TableCell id="table-header">Raid</TableCell>
                        <TableCell id="table-header">Zone</TableCell>
                        <TableCell id="table-header">Player</TableCell>
                        <TableCell id="table-header">Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => {
                        return (
                            <TableRow>
                                <TableCell id="clickable-cell"
                                           onClick={(_) => handleClick("raid", row?.raid?.id)}>{row?.raid.name}</TableCell>
                                <TableCell id="non-clickable-cell">{row?.raid.zone?.name || "null"}</TableCell>
                                <TableCell id="clickable-cell"
                                           onClick={(_) => handleClick("player", row?.player?.id)}>{row?.player?.name || "null"}
                                    <span id="char-class-span"> - {row?.mainAlt?.char_class}</span></TableCell>
                                <TableCell id="non-clickable-cell"
                                           onClick={(_) => handleClick("character", row?.mainAlt?.id)}>{row?.mainAlt?.name || "null"}
                                    <span id="char-class-span"> - {row?.mainAlt?.char_class}</span></TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        )
    }

    return table(getRaRows(data));
}
