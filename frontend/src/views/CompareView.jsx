import { useEffect, useState } from 'react';
import { Autocomplete, Container, TextField, Typography } from '@mui/material';
import { ItemAwardedListTable } from '../components/ItemAwardedListTable.jsx';
import { useList } from '../hooks/requests.js';
import { renderErrors } from './utils.jsx';

export function CompareView() {
    const [playerId1, setPlayerId1] = useState('');
    const [playerId2, setPlayerId2] = useState('');
    const [playerId3, setPlayerId3] = useState('');

    const {
        isPending: isPlayersPending,
        data: playersData,
        error: playersError,
    } = useList('players', '/players/');
    const {
        isPending: isItemAwardedPending1,
        data: itemAwardedData1,
        error: itemAwardedError1,
    } = useList('items_awarded', '/items_awarded/', { player: playerId1 });
    const {
        isPending: isItemAwardedPending2,
        data: itemAwardedData2,
        error: itemAwardedError2,
    } = useList('items_awarded', '/items_awarded/', { player: playerId2 });
    const {
        isPending: isItemAwardedPending3,
        data: itemAwardedData3,
        error: itemAwardedError3,
    } = useList('items_awarded', '/items_awarded/', { player: playerId3 });

    const errorsArray = [playersError, itemAwardedError1, itemAwardedError2, itemAwardedError3];

    useEffect(() => {
        if (playersData?.results && playersData.results.length > 0) {
            const players = playersData.results;
            setPlayerId1(players[0]?.id?.toString() || '');
            setPlayerId2(players[1]?.id?.toString() || '');
            setPlayerId3(players[2]?.id?.toString() || '');
        }
    }, [playersData]);

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

    const getPlayerAutoComplete = (playerId, changeHandler, label) => {
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
                                    borderBottom: 'none', // Remove active underline
                                },
                                '& .MuiInput-underline:before': {
                                    borderBottom: 'none', // Remove inactive underline
                                },
                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                    borderBottom: 'none', // Remove hover underlineonal)
                                },
                            }}
                        />
                    )}
                />
            </>
        );
    };

    const getItemAwardedInfo = itemAwardedData => {
        return (
            <Typography sx={{ mt: 5 }} variant="h6">
                Items Awarded - Total: {itemAwardedData.count}
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

    return (
        <Container
            disableGutters
            maxWidth={false}
            sx={{
                marginTop: 5,
                display: 'flex',
                gap: 1,
                height: '100%',
                width: '100%',
            }}
        >
            <Container>
                <Container>
                    {getPlayerAutoComplete(playerId1, handlePlayerId1Change, 'Player 1')}
                    {getRaInfo(playerId1, playersData.results)}
                    {!isItemAwardedPending1 && playerId1 && (
                        <>
                            {getItemAwardedInfo(itemAwardedData1)}
                            <ItemAwardedListTable data={itemAwardedData1.results} />
                        </>
                    )}
                </Container>
            </Container>
            <Container>
                <Container>
                    {getPlayerAutoComplete(playerId2, handlePlayerId2Change, 'Player 2')}
                    {getRaInfo(playerId2, playersData.results)}
                    {!isItemAwardedPending2 && playerId2 && (
                        <>
                            {getItemAwardedInfo(itemAwardedData2)}
                            <ItemAwardedListTable data={itemAwardedData2.results} />
                        </>
                    )}
                </Container>
            </Container>
            <Container>
                <Container>
                    {getPlayerAutoComplete(playerId3, handlePlayerId3Change, 'Player 3')}
                    {getRaInfo(playerId3, playersData.results)}
                    {!isItemAwardedPending3 && playerId3 && (
                        <>
                            {getItemAwardedInfo(itemAwardedData3)}
                            <ItemAwardedListTable data={itemAwardedData3.results} />
                        </>
                    )}
                </Container>
            </Container>
        </Container>
    );
}
