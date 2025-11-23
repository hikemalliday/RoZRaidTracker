import { useParams } from 'react-router';
import { useDetail, useList } from '../hooks/requests.js';
import { Container, Typography } from '@mui/material';
import { renderErrors } from './utils.jsx';
import { ItemAwardedListTable } from '../components/ItemAwardedListTable.jsx';
import { CharacterListTable } from '../components/CharacterListTable.jsx';
import { RaidAttendanceListTable } from '../components/RaidAttendanceListTable.jsx';

export function PlayerDetailView() {
    const { id } = useParams();
    const {
        isPending: isPlayerPending,
        data: playerData,
        error: playerError,
    } = useDetail('players', '/players/', id);
    const {
        isPending: isItemAwardedPending,
        data: itemAwardedData,
        error: itemAwardedError,
    } = useList('items_awarded', '/items_awarded/', { player: id });
    const {
        isPending: isCharacterPending,
        data: characterData,
        error: characterError,
    } = useList('characters', '/characters/', { player: id });

    const {
        isPending: isRaidsPending,
        data: raidsData,
        error: raidsError,
    } = useList('raid_attendance', '/raid_attendance/', { player: id });

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
            <Typography sx={{ mt: 5 }} variant="h5">
                Player: {playerData.name}
            </Typography>
            <Container>
                <Typography sx={{ mt: 1 }}>Lifetime RA: {playerData?.lifetime_ra}%</Typography>
                <Typography sx={{ mt: 1 }}>21 Day RA: {playerData?.ra_21_day}%</Typography>
            </Container>
            <Container>
                <Typography sx={{ mt: 5 }} variant="h6">
                    Items Awarded - Total: {itemAwardedData.count}
                </Typography>
                <ItemAwardedListTable data={itemAwardedData.results} sortable />
            </Container>
            <Container>
                <Typography sx={{ mt: 5 }} variant="h6">
                    Raids Attended: {raidsData.count}
                </Typography>
                <RaidAttendanceListTable data={_sortRaData(raidsData?.results)} sortable />
            </Container>
            <Container sx={{ mt: 9 }}>
                <Typography variant="h6">Characters</Typography>
                <CharacterListTable data={characterData.results} />
            </Container>
        </Container>
    );
}
