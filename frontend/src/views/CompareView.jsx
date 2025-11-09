import { useEffect, useState } from 'react';
import { Container, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { ItemAwardedListTable } from '../components/ItemAwardedListTable.jsx';
import { useItemAwardedList, usePlayerList } from '../hooks/requests.js';
import { renderErrors } from './utils.jsx';
import { selectComponentProps } from '../styles.js';

export function CompareView() {
    const [playerId1, setPlayerId1] = useState('');
    const [playerId2, setPlayerId2] = useState('');
    const [playerId3, setPlayerId3] = useState('');

    const { isPending: isPlayersPending, data: playersData, error: playersError } = usePlayerList();
    const {
        isPending: isItemAwardedPending1,
        data: itemAwardedData1,
        error: itemAwardedError1,
    } = useItemAwardedList({ player: playerId1 });
    const {
        isPending: isItemAwardedPending2,
        data: itemAwardedData2,
        error: itemAwardedError2,
    } = useItemAwardedList({ player: playerId2 });
    const {
        isPending: isItemAwardedPending3,
        data: itemAwardedData3,
        error: itemAwardedError3,
    } = useItemAwardedList({ player: playerId3 });

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

    const handlePlayerId1Change = e => {
        setPlayerId1(e.target.value);
    };

    const handlePlayerId2Change = e => {
        setPlayerId2(e.target.value);
    };

    const handlePlayerId3Change = e => {
        setPlayerId3(e.target.value);
    };

    const getPlayersMap = data => {
        const results = {};
        for (const player of data) {
            results[player.name] = player.id.toString();
        }
        return results;
    };

    const playersMap = getPlayersMap(playersData.results);
    const playersNamesArray = Object.keys(playersMap);

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
                    <Container>
                        <InputLabel sx={{ color: 'white' }}>Player</InputLabel>
                        <Select
                            {...selectComponentProps}
                            variant="standard"
                            onChange={handlePlayerId1Change}
                            label="player1"
                            value={playerId1}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {playersNamesArray.map((name, i) => (
                                <MenuItem key={i} value={playersMap[name]}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Container>
                    {!isItemAwardedPending1 && playerId1 && (
                        <>
                            <Typography sx={{ mt: 5 }} variant="h6">
                                Items Awarded - Total: {itemAwardedData1.count}
                            </Typography>
                            <ItemAwardedListTable data={itemAwardedData1.results} />
                        </>
                    )}
                </Container>
            </Container>
            <Container>
                <Container>
                    <Container>
                        <InputLabel sx={{ color: 'white' }}>Player</InputLabel>
                        <Select
                            {...selectComponentProps}
                            variant="standard"
                            onChange={handlePlayerId2Change}
                            label="player2"
                            value={playerId2}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {playersNamesArray.map((name, i) => (
                                <MenuItem key={i} value={playersMap[name]}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Container>
                    {!isItemAwardedPending2 && playerId2 && (
                        <>
                            <Typography sx={{ mt: 5 }} variant="h6">
                                Items Awarded - Total: {itemAwardedData2.count}
                            </Typography>
                            <ItemAwardedListTable data={itemAwardedData2.results} />
                        </>
                    )}
                </Container>
            </Container>
            <Container>
                <Container>
                    <Container>
                        <InputLabel sx={{ color: 'white' }}>Player</InputLabel>
                        <Select
                            {...selectComponentProps}
                            variant="standard"
                            onChange={handlePlayerId3Change}
                            label="player3"
                            value={playerId3}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {playersNamesArray.map((name, i) => (
                                <MenuItem key={i} value={playersMap[name]}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Container>
                    {!isItemAwardedPending3 && playerId3 && (
                        <>
                            <Typography sx={{ mt: 5 }} variant="h6">
                                Items Awarded - Total: {itemAwardedData3.count}
                            </Typography>
                            <ItemAwardedListTable data={itemAwardedData3.results} />
                        </>
                    )}
                </Container>
            </Container>
        </Container>
    );
}
