import {useParams} from "react-router";
import {useRaidAttendanceApproval, useRaidAttendanceApprovalMutation} from "../hooks/requests.js";
import {Button, Table, TableBody, TableCell, TableRow, TextField} from "@mui/material";
import {useState} from "react";


export function ApprovalDetailView() {
    const {id} = useParams();
    const {isPending, data, error} = useRaidAttendanceApproval(id);
    const {mutate} = useRaidAttendanceApprovalMutation(id);
    const [raid, setRaid] = useState("");

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;

    const submitApproval = async () => {
        const payload = {
            "raid_name": raid,
            "players": data?.players_list,
        }
        mutate({payload});
    };


    const getPlayersRows = (players) => {
        return players.map((player, i) => {
            return (<TableRow key={i}>
                <TableCell sx={{color: "white"}}>
                    {player}
                </TableCell>
            </TableRow>)
        })
    }

    const handleTextInput = (e) => {
        if (e.key === "enter") return e.preventDefault();
        setRaid(e.target.value);
    };

    return (
        <>
            <TextField color="secondary" sx={{
                '& .MuiInputBase-input': {
                    color: "white",
                }
            }}
            onKeyDown={handleTextInput}
            />
            <Table>
                <TableBody>
                    {getPlayersRows(data.players_list)}
                </TableBody>
            </Table>
            <Button onClick={submitApproval}>SUBMIT</Button>
        </>
    )

}
