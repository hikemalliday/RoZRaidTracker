import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, Container, TextField, Typography } from '@mui/material';
import { ItemAwardedListTable } from '../components/ItemAwardedListTable.jsx';
import { useItemsAwardedList, usePlayersList } from '../hooks/requests.js';
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
    } = useItemsAwardedList({ player: playerId1 });
    const {
        isPending: isItemAwardedPending2,
        data: itemAwardedData2,
        error: itemAwardedError2,
    } = useItemsAwardedList({ player: playerId2 });
    const {
        isPending: isItemAwardedPending3,
        data: itemAwardedData3,
        error: itemAwardedError3,
    } = useItemsAwardedList({ player: playerId3 });

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

        const filteredData = _filterItems(itemAwardedData?.results, filters);
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
