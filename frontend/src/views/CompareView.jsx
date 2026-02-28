import React, { useState } from 'react';
import { Autocomplete, Box, Checkbox, Container, FormControlLabel, TextField } from '@mui/material';
import { ItemAwardedListTable } from '../components/ItemAwardedListTable.jsx';
import { useItemsAwardedList, usePlayersList } from '../hooks/requests.js';
import { MetaDetail } from '../components/generic.jsx';
import { getItemAwardedMetaData, getPlayersOptions } from './utils.jsx';
// TODO: This page is a complete dumpster fire. Please for the love of god, come back and tame this mess.
export function CompareView() {
    const { isPending: isPlayersPending, data: playersData } = usePlayersList();

    if (isPlayersPending) return <>LOADING...</>;

    const reducedPlayersData = [];

    playersData.results.forEach(player => {
        const characters = player.characters;
        if (characters.length === 0) reducedPlayersData.push({ name: player.name, id: player.id });

        for (const char of characters) {
            reducedPlayersData.push({ name: `${player.name} | ${char.name}`, id: player.id });
        }
    });

    const getPlayersNameMap = data => {
        const results = {};
        for (const player of data) {
            results[player.id.toString()] = player.name;
        }
        return results;
    };

    const playersNameMap = getPlayersNameMap(reducedPlayersData);

    const sortItemsById = (results, asc = false) => {
        return results.sort((a, b) => {
            return asc ? a.id - b.id : b.id - a.id;
        });
    };

    const getPlayerAutoComplete = (playerId, changeHandler) => {
        return (
            <Autocomplete
                disableClearable
                sx={{
                    width: '200px',
                    margin: '0 auto',
                }}
                options={getPlayersOptions(playersData.results)}
                filterOptions={x => x}
                defaultValue={playersNameMap[playerId]}
                onChange={(_, option) => {
                    changeHandler(option.id);
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
                    {getItemAwardedMetaData(itemAwardedData?.results, filteredData.length)}
                    {!isPending && playerId && (
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
                marginTop: 2,
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
