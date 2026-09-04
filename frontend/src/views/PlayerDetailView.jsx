import { useNavigate, useParams } from 'react-router';
import {
    useCharactersList,
    useItemsAwardedList,
    usePlayerDetail,
    useRaidAttendanceList,
    useRaidAttendanceListPaginated,
} from '../hooks/requests.js';
import { Box, Container, Typography } from '@mui/material';
import { getItemAwardedMetaData, renderErrors, sortItemsByRaidDate } from './utils.jsx';
import { ItemAwardedListTable } from '../components/ItemAwardedListTable.jsx';
import { CharacterListTable } from '../components/CharacterListTable.jsx';
import { RaidAttendanceListTable } from '../components/RaidAttendanceListTable.jsx';
import { useAuthContext } from '../context/AuthContext.jsx';
import { labelStyles } from '../styles.js';
import { MetaDetail } from '../components/generic.jsx';
import { PaginatedListTable } from "../components/PaginatedListTable.jsx";
import React from "react";

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


    return (
        <Container sx={{ mt: 1 }}>
            {isAuthenticated && isSuperUser === true ? (
                <>
                    <button
                        style={{ marginTop: 5, marginBottom: 20 }}
                        onClick={() => navigate('edit')}
                    >
                        EDIT PLAYER
                    </button>
                </>
            ) : (
                <></>
            )}
            <MetaDetail label={'Player'} val={playerData.name} />
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 4 }}>
                <MetaDetail label={'Lifetime Ra'} val={playerData?.lifetime_ra} />
                <MetaDetail label={'21 Day Ra'} val={playerData?.ra_21_day} />
            </Box>
            <Container sx={{ mt: 5, mb: 5 }}>
                <Typography sx={labelStyles}>Characters</Typography>
                <CharacterListTable data={characterData.results} />
            </Container>
            <Container>
                <Box
                    sx={{
                        mb: 4,
                    }}
                >
                    {getItemAwardedMetaData(
                        itemAwardedData.results,
                        itemAwardedData.results.length
                    )}
                </Box>
                <ItemAwardedListTable
                    data={sortItemsByRaidDate(itemAwardedData.results)}
                    sortable
                    styledRows
                />
            </Container>
            <Box>
                <Typography sx={{ ...labelStyles, mb: 4 }}>
                    Raids Attended: {raidsData.count}
                </Typography>
                <PaginatedListTable
                    requestHook={useRaidAttendanceListPaginated}
                    TableComponent={RaidAttendanceListTable}
                    extraParams={{
                        player: id,
                    }}
                />
            </Box>
        </Container>
    );
}
