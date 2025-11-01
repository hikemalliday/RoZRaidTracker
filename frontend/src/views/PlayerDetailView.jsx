import {useNavigate, useParams} from "react-router";
import {useCharacterList, useItemAwardedList, usePlayer, useRaidAttendanceList} from "../hooks/requests.js";
import {
    getCharacterRows,
    getCharacterTable,
    getItemAwardedRows,
    getItemAwardedTable,
    getRaRows,
    getRaTable
} from "./utils.jsx";
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
    const {
        isPending: isCharacterPending,
        data: characterData,
        error: characterError,
    } = useCharacterList({player: id});

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

    if (isPlayerPending || isRaPending || isItemsAwardedPending || isCharacterPending) return <>LOADING...</>;

    const errorList = [playerError, raError, itemsAwardedError, characterError];
    if (errorList.some(Boolean)) return renderErrors(errorList);

    const itemAwardedRows = getItemAwardedRows(itemsAwardedData);
    const itemAwardedTable = getItemAwardedTable(itemAwardedRows, handleClick);

    const raRows = getRaRows(raData);
    const raTable = getRaTable(raRows, handleClick);

    const characterRows = getCharacterRows(characterData);
    const characterTable = getCharacterTable(characterRows, handleClick);

    return (
        <Container>
            <Typography sx={{ mt: 5 }} variant="h5">Player:  {playerData.name}</Typography>
            <Container>
                <Typography sx={{ mt: 5 }} variant="h6">Items Awarded</Typography>
                {itemAwardedTable}
            </Container>
            <Container sx={{mt: 9}}>
                <Typography variant="h6">Raid Attendance</Typography>
                {raTable}
            </Container>
            <Container sx={{mt: 9}}>
                <Typography variant="h6">Characters</Typography>
                {characterTable}
            </Container>
        </Container>

    )
}
