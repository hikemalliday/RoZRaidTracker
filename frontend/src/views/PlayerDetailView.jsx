import {useNavigate, useParams} from "react-router";
import {useCharacterList, useItemAwardedList, usePlayer, useRaidAttendanceList} from "../hooks/requests.js";
import {Container, Typography} from "@mui/material";
import {getCell, getItemIconCell, getLinkCell, TableList} from "../components/Tables.jsx";

export function PlayerDetailView() {
    const navigate = useNavigate();
    const {id} = useParams();
    const {isPending: isPlayerPending, data: playerData, error: playerError} = usePlayer(id);
    const {isPending: isRaPending, data: raData, error: raError} = useRaidAttendanceList({player: id});
    const {
        isPending: isItemAwardedPending,
        data: itemAwardedData,
        error: itemAwardedError
    } = useItemAwardedList({player: id});
    const {
        isPending: isCharacterPending,
        data: characterData,
        error: characterError,
    } = useCharacterList({player: id});

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

    if (isPlayerPending || isRaPending || isItemAwardedPending || isCharacterPending) return <>LOADING...</>;

    const errorList = [playerError, raError, itemAwardedError, characterError];
    if (errorList.some(Boolean)) return renderErrors(errorList);


    const itemAwardedHeaders = ["", "Name", "Player", "Raid", "Date"];
    const getItemAwardedCells = (data) => {
        return data.map((row) => {
            return [
                getItemIconCell(row?.item?.icon_id),
                getCell(row?.item?.name),
                getLinkCell(row?.player?.name, `/player/${row?.player?.id}`),
                getLinkCell(row?.raid?.name, `/raid/${row?.raid?.id}`),
                getCell(row?.created_at),
            ]
        });
    };

    const characterHeaders = ["Name", "Class", "Status", "Player"];

    const _getCharStatus = (char) => {
        if (char.is_main) return "Main";
        if (char.is_main_alt) return "Main Alt";
        return "Alt";
    }

    const getCharacterCells = (data) => {
        return data.map((row) => {
            return [
                getCell(row?.name),
                getCell(row?.char_class),
                getCell(_getCharStatus(row)),
                getLinkCell(row?.player.name, `/player/${row?.player?.id}`),
            ]
        })
    };

    return (
        <Container>
            <Typography sx={{ mt: 5 }} variant="h5">Player:  {playerData.name}</Typography>
            <Container>
                <Typography sx={{ mt: 1}}>Lifetime RA: {playerData?.lifetime_ra}%</Typography>
            </Container>
            <Container>
                <Typography sx={{ mt: 5 }} variant="h6">Items Awarded</Typography>
                <TableList headers={itemAwardedHeaders} reducedData={getItemAwardedCells(itemAwardedData)}/>
            </Container>
            <Container sx={{mt: 9}}>
                <Typography variant="h6">Characters</Typography>
                <TableList headers={characterHeaders} reducedData={getCharacterCells(characterData)}/>
            </Container>
        </Container>
    )
}
