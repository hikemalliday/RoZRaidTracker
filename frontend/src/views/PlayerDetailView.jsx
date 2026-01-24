import { useNavigate, useParams } from 'react-router';
import {
    useCharactersList,
    useItemsAwardedList,
    usePlayerDetail,
    useRaidAttendanceList,
} from '../hooks/requests.js';
import { Box, Container, Typography } from '@mui/material';
import { renderErrors } from './utils.jsx';
import { ItemAwardedListTable } from '../components/ItemAwardedListTable.jsx';
import { CharacterListTable } from '../components/CharacterListTable.jsx';
import { RaidAttendanceListTable } from '../components/RaidAttendanceListTable.jsx';
import { useAuthContext } from '../context/AuthContext.jsx';
import { labelStyles } from '../styles.js';
import { MetaDetail } from '../components/generic.jsx';

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

    const sortItemsById = results => {
        return results.sort((a, b) => {
            return b.id - a.id;
        });
    };

    return (
        <Container sx={{ mt: 1 }}>
            {isAuthenticated && isSuperUser === true ? (
                <>
                    <button style={{ marginTop: 5 }} onClick={_ => navigate('edit')}>
                        EDIT PLAYER
                    </button>
                </>
            ) : (
                <></>
            )}
            <MetaDetail label={'Player'} val={playerData.name} />
            <Container sx={{ mt: 5 }}>
                <Typography sx={labelStyles}>Characters</Typography>
                <CharacterListTable data={characterData.results} />
            </Container>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 4 }}>
                <MetaDetail label={'Lifetime Ra'} val={playerData?.lifetime_ra} />
                <MetaDetail label={'21 Day Ra'} val={playerData?.ra_21_day} />
            </Box>
            <Container>
                <Typography sx={labelStyles}>
                    Items Awarded - Total: {itemAwardedData.count}
                </Typography>
                <ItemAwardedListTable
                    data={sortItemsById(itemAwardedData.results)}
                    sortable
                    styledRows
                />
            </Container>
            <Container>
                <Typography sx={labelStyles}>Raids Attended: {raidsData.count}</Typography>
                <RaidAttendanceListTable data={_sortRaData(raidsData?.results)} sortable />
            </Container>
        </Container>
    );
}
