import React, { useState } from 'react';
import { Autocomplete, Box, Checkbox, Container, FormControlLabel, TextField } from '@mui/material';
import { ItemAwardedListTable } from '../components/ItemAwardedListTable.jsx';
import { useItemsAwardedList, usePlayersList } from '../hooks/requests.js';
import { MetaDetail } from '../components/generic.jsx';
import { getItemAwardedMetaData } from './utils.jsx';

export function CompareView() {
    const { isPending: isPlayersPending, data: playersData } = usePlayersList();

    if (isPlayersPending) return <>LOADING...</>;

    const getPlayersIdMap = data => {
        const results = {};
        for (const player of data) {
            results[player.name] = player.id.toString();
        }
        return results;
    };

    const getPlayersNameMap = data => {
        const results = {};
        for (const player of data) {
            results[player.id.toString()] = player.name;
        }
        return results;
    };

    const playersIdMap = getPlayersIdMap(playersData.results);
    const playersNameMap = getPlayersNameMap(playersData.results);
    const playersNamesArray = Object.keys(playersIdMap).sort();

    const sortItemsById = (results, asc = false) => {
        return results.sort((a, b) => {
            return asc ? a.id - b.id : b.id - a.id;
        });
    };

    const getPlayerAutoComplete = (playerId, changeHandler) => {
        return (
            <Autocomplete
                disableClearable
                options={playersNamesArray}
                value={playerId ? playersNameMap[playerId] : null}
                onChange={(e, playerName) => {
                    if (playerName) return changeHandler(playersIdMap[playerName]);
                    return changeHandler('');
                }}
                sx={{
                    width: '200px',
                    margin: '0 auto',
                }}
                renderInput={params => (
                    <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        placeholder="Select player"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '6px',
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'white',
                                },
                            },
                            input: {
                                textAlign: 'center',
                            },
                        }}
                    />
                )}
            />
        );
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
                    gap: 3,
                    mt: 2,
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

    function CompareTable({ playersList, defaultPlayerId = 1 }) {
        const [playerId, setPlayerId] = useState(defaultPlayerId);
        const { isPending, data: itemAwardedData } = useItemsAwardedList({ player: playerId });
        const [filters, setFilters] = useState(
            new Set(['main', 'alt_loot', 'preferred', 'magelo'])
        );

        const handlePlayerIdChange = playerIdArg => {
            setPlayerId(playerIdArg);
        };

        function _filterItems(results) {
            if (!results) return [];

            const fieldsToFilterOn = [...filters];
            const includeMain = fieldsToFilterOn.includes('main');
            const includeAltLoot = fieldsToFilterOn.includes('alt_loot');
            const includeMagelo = fieldsToFilterOn.includes('magelo');
            const includePreferred = fieldsToFilterOn.includes('preferred');

            return results.filter(item => {
                const isMainItem =
                    item.alt_loot === false && item.preferred === false && item.magelo === false;
                const isAltItem = item.alt_loot === true && item.magelo === false;
                const isMageloMainItem = item.magelo === true && item.alt_loot === false;
                const isMageloAltItem = item.magelo === true && item.alt_loot === true;
                const isPreferredItem = item.preferred === true;

                if (isPreferredItem && includePreferred) return true;
                if (isMageloMainItem && includeMagelo && includeMain) return true;
                if (isMageloAltItem && includeMagelo && includeAltLoot) return true;
                if (isAltItem && includeAltLoot) return true;
                if (isMainItem && includeMain) return true;
                return false;
            });
        }

        const _handleCheckbox = (e, filter) => {
            if (e.target.checked)
                setFilters(prev => {
                    const filters = new Set(prev);
                    filters.add(filter);
                    return filters;
                });
            else
                setFilters(prev => {
                    const filters = new Set(prev);
                    filters.delete(filter);
                    return filters;
                });
        };

        const filteredData = _filterItems(itemAwardedData?.results);
        return (
            <Container disableGutters>
                <Container>
                    {getPlayerAutoComplete(playerId, handlePlayerIdChange)}
                    {getRaInfo(playerId, playersList)}
                    {!isPending && playerId && (
                        <>
                            {getItemAwardedMetaData(itemAwardedData?.results)}
                            <Box
                                sx={{
                                    mt: 2,
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
                                    { label: 'Magelo', filter: 'magelo' },
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
                            <ItemAwardedListTable
                                data={sortItemsById(filteredData)}
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

    return (
        <Container
            disableGutters
            maxWidth={false}
            sx={{
                marginTop: 5,
                display: 'flex',
                height: '100%',
                width: '100%',
            }}
        >
            {<CompareTable playersList={playersData.results} defaultPlayerId={1} />}
            {<CompareTable playersList={playersData.results} defaultPlayerId={2} />}
            {<CompareTable playersList={playersData.results} defaultPlayerId={3} />}
        </Container>
    );
}
