import { useParams } from 'react-router';
import {
    useDetail,
    useList,
    useRaidAttendanceDelete,
    useRaidAttendanceMutation,
} from '../hooks/requests.js';
import { useAuthContext } from '../context/AuthContext.jsx';
import { Autocomplete, Container, TextField, Typography } from '@mui/material';
import { getPlayersListFinal, renderErrors } from './utils.jsx';
import { useEffect, useRef, useState } from 'react';
import { useMessage } from '../context/MessageContext.jsx';
import { textFieldStyles } from '../styles.js';

function AddPlayerField({ raidId, styles = {} }) {
    const { data: playersData, isPending: isPlayersPending } = useList('players', '/players/');
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const { mutate } = useRaidAttendanceMutation();

    const handleSubmit = () => {
        const payload = {
            raid_id: raidId,
            player_id: selectedPlayer,
        };
        mutate({ payload });
    };

    return (
        <Container
            sx={{
                ...styles,
                display: 'flex',
            }}
        >
            <Autocomplete
                renderInput={params => (
                    <TextField {...params} label="Player" sx={textFieldStyles} size="small" />
                )}
                options={!isPlayersPending ? getPlayersListFinal(playersData.results) : []}
                onChange={(_, option) => {
                    setSelectedPlayer(option.id);
                }}
            />
            <button onClick={handleSubmit}>ADD PLAYER</button>
        </Container>
    );
}

function EditPlayerField({ playerName, raId, raRowsToDelete, styles = {} }) {
    const _handleCheckbox = e => {
        if (e.target.checked) {
            return raRowsToDelete.current.push(raId);
        }
        raRowsToDelete.current = raRowsToDelete.current.filter(p => p !== raId);
    };

    return (
        <Container
            sx={{
                ...styles,
                mt: 1,
                display: 'flex',
            }}
        >
            <Typography>{playerName}</Typography>
            <input type="checkbox" onClick={_handleCheckbox} />
        </Container>
    );
}

export function RaidEditView() {
    const { id } = useParams();
    const { isSuperUser } = useAuthContext();
    const { isPending, data, error } = useDetail('raids', '/raids/', id);
    const {
        isPending: isRaPending,
        data: raData,
        error: raError,
    } = useList('raid_attendance', '/raid_attendance/', { raid: id });
    const {
        isPending: isItemAwardedPending,
        data: itemAwardedData,
        error: itemAwardedError,
    } = useList('items_awarded', '/items_awarded/', { raid: id });
    const {
        isPending: isPlayersPending,
        data: playersData,
        error: playersError,
    } = useList('players', '/players/');
    const { mutate } = useRaidAttendanceDelete();
    const [playersToRender, setPlayersToRender] = useState([]);
    const raRowsToDelete = useRef([]);
    const { addMessage } = useMessage();

    const pendingList = [isPending, isRaPending, isItemAwardedPending, isPlayersPending];
    const errorList = [error, raError, itemAwardedError, playersError];

    useEffect(() => {
        const playersList = raData?.results
            .map(ra => {
                return [ra.player.name, ra.id];
            })
            .sort((a, b) => {
                return a[0].localeCompare(b[0]);
            });

        setPlayersToRender(playersList);
    }, [raData]);

    const _sortPlayers = data => {
        return data.sort((a, b) => {
            const valA = a.player.name;
            const valB = b.player.name;
            return valA.localeCompare(valB);
        });
    };

    if (pendingList.some(Boolean)) return <>LOADING...</>;
    if (errorList.some(Boolean)) return <>{renderErrors(errorList)}</>;
    if (!isSuperUser) return <>Unauthorized.</>;

    const getEditPlayerFields = () => {
        return playersToRender.map(([playerName, raId], i) => {
            return (
                <EditPlayerField
                    key={raId}
                    raRowsToDelete={raRowsToDelete}
                    playerName={playerName}
                    raId={raId}
                />
            );
        });
    };

    const handleRemovePlayersSubmit = async _ => {
        if (raRowsToDelete.current.length === 0) return;
        const promises = raRowsToDelete.current.map(p => {
            return mutate(p);
        });
        await Promise.allSettled(promises);
        raRowsToDelete.current = [];
    };

    return (
        <Container>
            <Container>
                <Typography sx={{ mt: 1 }} variant="h5">
                    {data?.name}
                </Typography>
                <Typography>
                    <strong>Zone:</strong> {data?.zone?.name}
                </Typography>
                <strong>Date:</strong> {data?.created_at}
            </Container>
            <Typography sx={{ mb: 2 }} variant="h6">
                Attendees - Total: {raData.count}
            </Typography>
            {<AddPlayerField raidId={id} />}
            <button
                style={{
                    display: 'flex',
                    alignItems: 'left',
                    marginTop: 5,
                }}
                onClick={handleRemovePlayersSubmit}
            >
                Remove Selected Players
            </button>
            {getEditPlayerFields()}
        </Container>
    );
}
