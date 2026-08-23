import React, { useState } from 'react';
import { Box, Checkbox, Container, FormControlLabel } from '@mui/material';
import { ItemAwardedListTable } from '../components/ItemAwardedListTable.jsx';
import { useItemsAwardedList, usePlayersList } from '../hooks/requests.js';
import { MetaDetail } from '../components/generic.jsx';
import { getItemAwardedMetaData, sortItemsByRaidDate } from './utils.jsx';
import { PlayerAutoComplete } from '../components/PlayerAutoComplete.jsx';

function CompareTable({ playersList, playersData, filtersState, defaultPlayerId = 1 }) {
    const [playerId, setPlayerId] = useState(defaultPlayerId);
    const { isPending, data: itemAwardedData } = useItemsAwardedList({ player: playerId });

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
    // TODO: The current filter approach only works for types -- do we really want to be able to filter by tier? kinda a pita to do that
    // TODO: Maybe we just keep filters based on types, and just display the metadata for item counts for tiers?
    // Ya I think we just leave it out for now until they decide its somehow relevant. Just show metadata and call it for now
    function _filterItems(results) {
        if (!results) return [];
        const fieldsToFilterOn = [...filtersState];
        return results.filter(item => {
            if (item.type === 'main' && fieldsToFilterOn.includes('main')) return true;
            if (item.type === 'alt' && fieldsToFilterOn.includes('alt')) return true;
            if (item.type === 'preferred_magelo' && fieldsToFilterOn.includes('preferred_magelo')) return true;
            if (item.type === 'preferred' && fieldsToFilterOn.includes('preferred')) return true;
            if (item.type === 'main_magelo' && fieldsToFilterOn.includes('main_magelo')) return true;
            if (item.type === 'alt_magelo' && fieldsToFilterOn.includes('alt_magelo')) return true;
            if (item.type === 'main_alt' && fieldsToFilterOn.includes('main_alt')) return true;
            return false;
        });
    }

    const filteredData = _filterItems(itemAwardedData?.results);
    return (
        <Container disableGutters>
            <Container>
                <PlayerAutoComplete playerId={playerId} playerIdSetter={setPlayerId} playersData={playersData} />
                {getRaInfo(playerId, playersList)}
                {getItemAwardedMetaData(itemAwardedData?.results, filteredData.length)}
                {!isPending && playerId && (
                    <>
                        <ItemAwardedListTable
                            data={sortItemsByRaidDate(filteredData)}
                            sortable
                            styledRows
                            enableToolTip={true}
                            dataTestId={playerId}
                            excludePlayer
                        />
                    </>
                )}
            </Container>
        </Container>
    );
}

export function CompareItemsView() {
    const { isPending: isPlayersPending, data: playersData } = usePlayersList();
    // TODO: Would be cool if we could somehow abstract all of the places that use ItemAwarded type's into config or something
    const [filters, setFilters] = useState(
        new Set([
            'main',
            'alt',
            'preferred',
            'main_magelo',
            'alt_magelo',
            'preferred_magelo',
            'main_alt',
        ]),
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
    // TODO: This is so that we can display 'rows' of the filters on top of each-other
    // Im sure there is a better way to handle this
    const filters1 = [
        { label: 'Main', filter: 'main' },
        { label: 'Alt', filter: 'alt' },
        { label: 'Main Alt', filter: 'main_alt' },
        { label: 'Preferred', filter: 'preferred' },
    ];
    const filters2 = [
        { label: 'Magelo Alt', filter: 'alt_magelo' },
        { label: 'Magelo Preferred', filter: 'preferred_magelo' },
        { label: 'Magelo Main', filter: 'main_magelo' },
    ];

    const getFilterCheckBoxes = (filters) => {
        return (
            <Box
                sx={{
                    mt: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1,
                    flexWrap: 'wrap',
                }}
            >
                {filters.map(({ label, filter }) => (
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
        )
    };

    return (
        <>
            {getFilterCheckBoxes(filters1)}
            {getFilterCheckBoxes(filters2)}
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
