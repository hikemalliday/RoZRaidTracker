import React, { useState } from 'react';
import { Box, Checkbox, Container, FormControlLabel } from '@mui/material';
import { ItemAwardedListTable } from '../components/ItemAwardedListTable.jsx';
import { useItemsAwardedList, usePlayersList } from '../hooks/requests.js';
import { MetaDetail } from '../components/generic.jsx';
import {getItemAwardedMetaData, sortItemsByRaidDate} from './utils.jsx';
import { PlayerAutoComplete } from '../components/PlayerAutoComplete.jsx';

function CompareTable({ playersList, playersData, filtersState, defaultPlayerId = 1 }) {
    const [playerId, setPlayerId] = useState(defaultPlayerId);
    const { isPending, data: itemAwardedData } = useItemsAwardedList({ player: playerId });

    const sortItemsById = (results, asc = false) => {
        return results.sort((a, b) => {
            return asc ? a.id - b.id : b.id - a.id;
        });
    };

    const getRaInfo = (playerId, playersList) => {
        if (!playerId) return null;
        const playerDetail = playersList.find(player => {
            return player.id == playerId;
        });
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                    mt: 1,
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <MetaDetail label={'Lifetime RA'} val={`${playerDetail.lifetime_ra}%`} />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <MetaDetail label={'21 Day RA'} val={`${playerDetail.ra_21_day}%`} />
                </Box>
            </Box>
        );
    };

    function _filterItems(results) {
        if (!results) return [];

        const fieldsToFilterOn = [...filtersState];
        const includeMain = fieldsToFilterOn.includes('main');
        const includeAltLoot = fieldsToFilterOn.includes('alt_loot');
        const includeMageloMain = fieldsToFilterOn.includes('magelo_main');
        const includePreferred = fieldsToFilterOn.includes('preferred');
        const includePreferredMagelo = fieldsToFilterOn.includes('magelo_preferred');
        const includeMageloAlt = fieldsToFilterOn.includes('magelo_alt');

        return results.filter(item => {
            const isMainItem =
                item.alt_loot === false && item.magelo === false && item.preferred === false;
            const isAltItem =
                item.alt_loot === true && item.magelo === false && item.preferred === false;
            const isMageloMainItem =
                item.alt_loot === false && item.magelo === true && item.preferred === false;
            const isMageloAltItem =
                item.alt_loot === true && item.magelo === true && item.preferred === false;
            const isPreferredMagelo =
                item.alt_loot === false && item.magelo === true && item.preferred === true;
            const isPreferredItem =
                item.alt_loot === false && item.magelo === false && item.preferred === true;

            if (isMainItem && includeMain) return true;
            if (isAltItem && includeAltLoot) return true;
            if (isPreferredMagelo && includePreferredMagelo) return true;
            if (isPreferredItem && includePreferred) return true;
            if (isMageloMainItem && includeMageloMain) return true;
            if (isMageloAltItem && includeMageloAlt) return true;
            return false;
        });
    }

    const filteredData = _filterItems(itemAwardedData?.results);
    return (
        <Container disableGutters>
            <Container>
                <PlayerAutoComplete
                    playerId={playerId}
                    playerIdSetter={setPlayerId}
                    playersData={playersData}
                />
                {getRaInfo(playerId, playersList)}
                {getItemAwardedMetaData(itemAwardedData?.results, filteredData.length)}
                {!isPending && playerId && (
                    <>
                        <ItemAwardedListTable
                            data={sortItemsByRaidDate(filteredData)}
                            highlight21Day
                            sortable
                            styledRows
                            enableToolTip={true}
                            dataTestId={playerId}
                        />
                    </>
                )}
            </Container>
        </Container>
    );
}

export function CompareItemsView() {
    const { isPending: isPlayersPending, data: playersData } = usePlayersList();
    const [filters, setFilters] = useState(
        new Set(['main', 'alt_loot', 'preferred', 'magelo_main', 'magelo_alt', 'magelo_preferred'])
    );
    const _handleCheckbox = (e, filter) => {
        let objMethod = 'delete';
        if (e.target.checked) {
            objMethod = 'add';
        }
        setFilters(prev => {
            const filters = new Set(prev);
            filters[objMethod](filter);
            return filters;
        });
    };
    if (isPlayersPending) return <>LOADING...</>;

    return (
        <>
            <Box
                sx={{
                    mt: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1,
                    flexWrap: 'wrap',
                }}
            >
                {[
                    { label: 'Main', filter: 'main' },
                    { label: 'Alt', filter: 'alt_loot' },
                    { label: 'Preferred', filter: 'preferred' },
                    { label: 'Magelo Main', filter: 'magelo_main' },
                    { label: 'Magelo Alt', filter: 'magelo_alt' },
                    { label: 'Magelo Preferred', filter: 'magelo_preferred' },
                ].map(({ label, filter }) => (
                    <FormControlLabel
                        key={filter}
                        control={
                            <Checkbox
                                defaultChecked
                                size="small"
                                onChange={e => _handleCheckbox(e, filter)}
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.3)',
                                    '&.Mui-checked': {
                                        color: 'rgba(255, 255, 255, 0.5)',
                                    },
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                }}
                            />
                        }
                        label={label}
                        sx={{
                            '& .MuiFormControlLabel-label': {
                                fontSize: '0.8rem',
                                color: 'white',
                            },
                        }}
                    />
                ))}
            </Box>
            <Container
                disableGutters
                maxWidth={false}
                sx={{
                    marginTop: 2,
                    display: 'flex',
                    height: '100%',
                    width: '100%',
                }}
            >
                {
                    <CompareTable
                        playersList={playersData.results}
                        playersData={playersData}
                        defaultPlayerId={1}
                        filtersState={filters}
                    />
                }
                {
                    <CompareTable
                        playersList={playersData.results}
                        playersData={playersData}
                        defaultPlayerId={2}
                        filtersState={filters}
                    />
                }
                {
                    <CompareTable
                        playersList={playersData.results}
                        playersData={playersData}
                        defaultPlayerId={3}
                        filtersState={filters}
                    />
                }
            </Container>
        </>
    );
}
