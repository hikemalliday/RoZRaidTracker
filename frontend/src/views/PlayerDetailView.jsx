import { useNavigate, useParams } from 'react-router';
import {
    useCharactersList,
    useItemsAwardedList,
    usePlayerDetail,
    useRaidAttendanceList,
} from '../hooks/requests.js';
import { Container, Typography } from '@mui/material';
import { renderErrors } from './utils.jsx';
import { ItemAwardedListTable } from '../components/ItemAwardedListTable.jsx';
import { CharacterListTable } from '../components/CharacterListTable.jsx';
import { RaidAttendanceListTable } from '../components/RaidAttendanceListTable.jsx';
import { useAuthContext } from '../context/AuthContext.jsx';

export function PlayerDetailView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isSuperUser, isAuthenticated } = useAuthContext();
    const {
        isPending: isPlayerPending,
        data: playerData,
        error: playerError,
    } = usePlayerDetail(id);
    const {
        isPending: isItemAwardedPending,
        data: itemAwardedData,
        error: itemAwardedError,
    } = useItemsAwardedList({ player: id });
    const {
        isPending: isCharacterPending,
        data: characterData,
        error: characterError,
    } = useCharactersList({ player: id });

    const {
        isPending: isRaidsPending,
        data: raidsData,
        error: raidsError,
    } = useRaidAttendanceList({ player: id });

    if (isPlayerPending || isItemAwardedPending || isCharacterPending || isRaidsPending)
        return <>LOADING...</>;

    const errorList = [playerError, itemAwardedError, characterError, raidsError];
    if (errorList.some(Boolean)) return renderErrors(errorList);

    const _sortRaData = raData => {
        return raData.sort((a, b) => {
            const valA = a.created_at;
            const valB = b.created_at;
            return valB.localeCompare(valA);
        });
    };

    return (
        <Container>
            {isAuthenticated && isSuperUser === true ? (
                <>
                    <button style={{ marginTop: 5 }} onClick={_ => navigate('edit')}>
                        EDIT PLAYER
                    </button>
                </>
            ) : (
                <></>
            )}
            <Typography sx={{ mt: 5 }} variant="h5">
                Player: {playerData.name}
            </Typography>
            <Container sx={{ mt: 5 }}>
                <Typography variant="h6">Characters</Typography>
                <CharacterListTable data={characterData.results} />
            </Container>
            <Container sx={{ mt: 7 }}>
                <Typography sx={{ mt: 1 }}>Lifetime RA: {playerData?.lifetime_ra}%</Typography>
                <Typography sx={{ mt: 1 }}>21 Day RA: {playerData?.ra_21_day}%</Typography>
            </Container>
            <Container>
                <Typography sx={{ mt: 5 }} variant="h6">
                    Items Awarded - Total: {itemAwardedData.count}
                </Typography>
                <ItemAwardedListTable data={itemAwardedData.results} sortable styledRows />
            </Container>
            <Container>
                <Typography sx={{ mt: 5 }} variant="h6">
                    Raids Attended: {raidsData.count}
                </Typography>
                <RaidAttendanceListTable data={_sortRaData(raidsData?.results)} sortable />
            </Container>
        </Container>
    );
}
