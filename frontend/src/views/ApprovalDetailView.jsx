import {useParams} from "react-router";
import {useRaidAttendanceApproval} from "../hooks/requests.js";
import {Table, TableBody, TableCell, TableRow} from "@mui/material";


export function ApprovalDetailView() {
    const {id} = useParams();
    const {isPending, data, error} = useRaidAttendanceApproval(id);

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;

    const getPlayersRows = (players) => {
        return players.map((player, i) => {
            return (<TableRow key={i}>
                <TableCell sx={{ color: "white"}}>
                    {player}
                </TableCell>
            </TableRow>)
        })
    }

    return (
        <Table>
            <TableBody>
                {getPlayersRows(data.players_list)}
            </TableBody>
        </Table>
    )

}
