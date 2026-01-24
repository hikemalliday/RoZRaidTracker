import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, Container, TextField, Typography } from '@mui/material';
import { ItemAwardedListTable } from '../components/ItemAwardedListTable.jsx';
import { useItemsAwardedList, usePlayersList } from '../hooks/requests.js';

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
        const veryDarkGray = '#333';

        return (
            <>
                <Autocomplete
                    options={playersNamesArray}
                    value={playerId ? playersNameMap[playerId] : null}
                    onChange={(e, playerName) => {
                        if (playerName) return changeHandler(playersIdMap[playerName]);
                        return changeHandler('');
                    }}
                    renderInput={params => (
                        <TextField
                            {...params}
                            variant="standard"
                            sx={{
                                input: {
                                    color: 'white',
                                    backgroundColor: veryDarkGray,
                                    textAlign: 'center',
                                    transform: 'translateX(25px)',
                                },
                                '& .MuiInput-underline:after': {
                                    borderBottom: 'none',
                                },
                                '& .MuiInput-underline:before': {
                                    borderBottom: 'none',
                                },
                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                    borderBottom: 'none',
                                },
                            }}
                        />
                    )}
                />
            </>
        );
    };

    const getItemAwardedCount = itemAwardedCount => {
        return (
            <Typography sx={{ mt: 5 }} variant="h6">
                Items Awarded - Total: {itemAwardedCount}
            </Typography>
        );
    };

    const getRaInfo = (playerId, playersList) => {
        if (!playerId) return null;
        const playerDetail = playersList.find(player => {
            return player.id == playerId;
        });
        return (
            <>
                <Typography sx={{ mt: 3 }}>
                    {`Lifetime RA: `}
                    <span style={{ fontWeight: 'bold' }}>{playerDetail.lifetime_ra}%</span>
                </Typography>
                <Typography>
                    {`21 Day RA: `}
                    <span style={{ fontWeight: 'bold' }}>{playerDetail.ra_21_day}%</span>
                </Typography>
            </>
        );
    };

    function CompareTable({ playersList, defaultPlayerId = 1 }) {
        const [playerId, setPlayerId] = useState(defaultPlayerId);
        const { isPending, data: itemAwardedData } = useItemsAwardedList({ player: playerId });
        const [itemsState, setItemsState] = useState(itemAwardedData?.results || []);
        const [filters, setFilters] = useState(
            new Set(['main', 'alt_loot', 'preferred', 'magelo'])
        );

        useEffect(() => {
            setItemsState(itemAwardedData?.results);
        }, [itemAwardedData]);

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

        const filteredData = _filterItems(itemsState);
        return (
            <Container disableGutters>
                <Container>
                    {getPlayerAutoComplete(playerId, handlePlayerIdChange)}
                    {getRaInfo(playerId, playersList)}
                    {!isPending && playerId && (
                        <>
                            {getItemAwardedCount(filteredData.length)}
                            <Box
                                sx={{
                                    mt: '20px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '40px',
                                }}
                            >
                                <Box>
                                    <Typography>Main</Typography>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        onChange={e => _handleCheckbox(e, 'main')}
                                    />
                                </Box>
                                <Box>
                                    <Typography>Alt</Typography>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        onChange={e => _handleCheckbox(e, 'alt_loot')}
                                    />
                                </Box>
                                <Box>
                                    <Typography>Preferred</Typography>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        onChange={e => _handleCheckbox(e, 'preferred')}
                                    />
                                </Box>
                                <Box>
                                    <Typography>Magelo</Typography>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        onChange={e => _handleCheckbox(e, 'magelo')}
                                    />
                                </Box>
                            </Box>
                            <ItemAwardedListTable
                                data={sortItemsById(filteredData)}
                                highlight21Day
                                sortable
                                styledRows
                                enableToolTip={false}
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
