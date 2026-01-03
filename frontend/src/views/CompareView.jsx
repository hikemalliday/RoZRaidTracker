import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, Container, TextField, Typography } from '@mui/material';
import { ItemAwardedListTable } from '../components/ItemAwardedListTable.jsx';
import { useItemsList, useList, usePlayersList } from '../hooks/requests.js';
import { renderErrors } from './utils.jsx';

export function CompareView() {
    const [playerId1, setPlayerId1] = useState('');
    const [playerId2, setPlayerId2] = useState('');
    const [playerId3, setPlayerId3] = useState('');

    const {
        isPending: isPlayersPending,
        data: playersData,
        error: playersError,
    } = usePlayersList();
    const {
        isPending: isItemAwardedPending1,
        data: itemAwardedData1,
        error: itemAwardedError1,
    } = useItemsList({ player: playerId1 });
    const {
        isPending: isItemAwardedPending2,
        data: itemAwardedData2,
        error: itemAwardedError2,
    } = useItemsList({ player: playerId2 });
    const {
        isPending: isItemAwardedPending3,
        data: itemAwardedData3,
        error: itemAwardedError3,
    } = useItemsList({ player: playerId3 });

    useEffect(() => {
        if (playersData?.results && playersData.results.length > 0) {
            const players = playersData.results;
            setPlayerId1(players[0]?.id?.toString() || '');
            setPlayerId2(players[1]?.id?.toString() || '');
            setPlayerId3(players[2]?.id?.toString() || '');
        }
    }, [playersData]);

    const errorsArray = [playersError, itemAwardedError1, itemAwardedError2, itemAwardedError3];
    if (isPlayersPending) return <>LOADING...</>;
    if (errorsArray.some(Boolean)) return <>{renderErrors(errorsArray)}</>;

    const handlePlayerId1Change = playerId => {
        setPlayerId1(playerId);
    };

    const handlePlayerId2Change = playerId => {
        setPlayerId2(playerId);
    };

    const handlePlayerId3Change = playerId => {
        setPlayerId3(playerId);
    };

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

    const sortItemsById = results => {
        return results.sort((a, b) => {
            return b.id - a.id;
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

    function CompareTable({
        playerId,
        playersList,
        handlePlayerIdChange,
        isPending,
        itemAwardedData,
    }) {
        // Using a Set here will allow us to simplify adding or removing filters based on checkbox inputs
        const [filters, setFilters] = useState(
            new Set(['main', 'alt_loot', 'preferred', 'magelo'])
        );
        function _filterItems(results) {
            // This is kinda funky, but since 'main' is not an actual field in the ItemAwarded table, we needed a way to handle filtering by 'main' loot
            if (!results) return [];
            const modelFields = ['alt_loot', 'preferred', 'magelo'];
            const fieldsToFilterOn = [...filters];
            const includeMain = fieldsToFilterOn.includes('main');

            return results.filter(item => {
                const realMatch = fieldsToFilterOn.some(field => item[field] === true);
                if (realMatch) {
                    return true;
                }
                // No matches for filters that are actual fields on ItemAwardedModel, so now we check for 'main'
                if (includeMain) {
                    return modelFields.every(field => item[field] === false);
                }
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

        const filteredData = _filterItems(itemAwardedData?.results, filters);
        return (
            <Container disableGutters>
                <Container>
                    {getPlayerAutoComplete(playerId, handlePlayerIdChange)}
                    {getRaInfo(playerId, playersList)}
                    {!isPending && playerId && (
                        <>
                            {getItemAwardedCount(itemAwardedData.count)}
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
            {
                <CompareTable
                    playerId={playerId1}
                    playersList={playersData.results}
                    handlePlayerIdChange={handlePlayerId1Change}
                    isPending={isItemAwardedPending1}
                    itemAwardedData={itemAwardedData1}
                />
            }
            {
                <CompareTable
                    playerId={playerId2}
                    playersList={playersData.results}
                    handlePlayerIdChange={handlePlayerId2Change}
                    isPending={isItemAwardedPending2}
                    itemAwardedData={itemAwardedData2}
                />
            }
            {
                <CompareTable
                    playerId={playerId3}
                    playersList={playersData.results}
                    handlePlayerIdChange={handlePlayerId3Change}
                    isPending={isItemAwardedPending3}
                    itemAwardedData={itemAwardedData3}
                />
            }
        </Container>
    );
}
