import {useNavigate, useParams} from "react-router";
import {useItemAwardedList, usePlayer, useRaidAttendanceList} from "../hooks/requests.js";
import {getItemAwardedRows, getItemAwardedTable, getRaRows, getRaTable} from "./utils.jsx";
import {Container, Typography} from "@mui/material";

export function PlayerDetailView() {
    const navigate = useNavigate();
    const {id} = useParams();
    const {isPending: isPlayerPending, data: playerData, error: playerError} = usePlayer(id);
    const {isPending: isRaPending, data: raData, error: raError} = useRaidAttendanceList({player: id});
    const {
        isPending: isItemsAwardedPending,
        data: itemsAwardedData,
        error: itemsAwardedError
    } = useItemAwardedList({player: id});

    const handleClick = (view, id) => {
        return navigate(`/${view}/${id}`, {replace: true});
    }

    const renderErrors = (errorsList) => {
        return (
            <div id="errors-list">
                {errorsList.map((err) => {
                    return (<div>
                        {err.message}
                    </div>)
                })}
            </div>
        )
    }

    if (isPlayerPending || isRaPending || isItemsAwardedPending) return <>LOADING...</>;
    if (playerError || raError || itemsAwardedError) return renderErrors([playerError, raError,]);


    const itemAwardedRows = getItemAwardedRows(itemsAwardedData);
    const itemAwardedTable = getItemAwardedTable(itemAwardedRows, handleClick);

    const raRows = getRaRows(raData);
    const raTable = getRaTable(raRows, handleClick);

    return (
        <Container>
            <Container>
                <Typography variant="h6">Items Awarded</Typography>
                {itemAwardedTable}
            </Container>
            <Container sx={{mt: 9}}>
                <Typography variant="h6">Raid Attendance</Typography>
                {raTable}
            </Container>
        </Container>

    )
}
