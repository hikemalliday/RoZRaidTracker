import { useParams } from 'react-router';
import {
    usePlayersList,
    useRaidAttendanceApprovalDetail,
    useRaidAttendanceApprovalMutation,
} from '../hooks/requests.js';
import { Autocomplete, Box, Container, TableCell, TableRow, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { fieldCardStyles, tableBox, textFieldStyles } from '../styles.js';
import { getCell, TableList } from '../components/Tables.jsx';
import { useAuthContext } from '../context/AuthContext.jsx';
import { getPlayersOptions } from './utils.jsx';
import { DataField } from '../components/DataField.jsx';

// Player dropdown at top + button
function AddPlayerField({ playersToSubmit, setPlayersToSubmit, styles = {} }) {
    const { data: playersData, isPending: isPlayersPending } = usePlayersList();
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const handleSubmit = () => {
        if (!selectedPlayer) return;
        if (playersToSubmit.some(p => p.name === selectedPlayer.name)) return;
        const newPlayersToSubmit = [...playersToSubmit];
        newPlayersToSubmit.unshift(selectedPlayer);
        return setPlayersToSubmit(newPlayersToSubmit);
    };

    return (
        <Box
            sx={{
                ...fieldCardStyles,
                ...styles,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'flex-start',
                }}
            >
                <Autocomplete
                    sx={{ flex: 1 }}
                    renderInput={params => (
                        <TextField {...params} label="Player" sx={textFieldStyles} size="small" />
                    )}
                    options={!isPlayersPending ? getPlayersOptions(playersData.results) : []}
                    onChange={(_, option) => {
                        setSelectedPlayer({ name: option.label, is_selected: true });
                    }}
                />
                <button style={{ backgroundColor: '#2a2a2a' }} onClick={handleSubmit}>
                    ADD PLAYER
                </button>
            </Box>
        </Box>
    );
}

export function PlayersToSubmitTable({ playersToSubmit, setPlayersToSubmit, onSubmit, ...rest }) {
    const getPlayersRows = players => {
        const _getPlayerCheckbox = player => {
            const _handleCheckboxClick = e => {
                const checked = e.target.checked;
                return setPlayersToSubmit(prev => {
                    return prev.map(p =>
                        p.name === player.name ? { ...p, is_selected: !!checked } : p
                    );
                });
            };

            return (
                <input
                    type="checkbox"
                    defaultChecked
                    onChange={e => _handleCheckboxClick(e, player)}
                />
            );
        };

        const sortedPlayers = players.sort((a, b) => {
            const valA = a.name;
            const valB = b.name;
            return valA.localeCompare(valB);
        });

        return sortedPlayers.map(player => {
            return (
                <TableRow key={player.id}>
                    {getCell(player.name)}
                    <TableCell align="right">{_getPlayerCheckbox(player)}</TableCell>
                </TableRow>
            );
        });
    };

    // Null vals means col is not sortable (frontend table sorting)
    const headerMap = {
        Name: 'player.name',
        Include: null,
    };
    const headerAlign = {
        Include: 'right',
    };

    return (
        <Box sx={tableBox}>
            <TableList
                headerMap={headerMap}
                headerAlign={headerAlign}
                data={playersToSubmit}
                getTableRows={getPlayersRows}
                {...rest}
            />
        </Box>
    );
}

export function ApprovalPendingDetailView() {
    const { id } = useParams();
    const { isSuperUser } = useAuthContext();
    const { isPending, data, error } = useRaidAttendanceApprovalDetail(id);
    const { mutate } = useRaidAttendanceApprovalMutation(id);
    const [raid, setRaid] = useState('');
    const [playersToSubmit, setPlayersToSubmit] = useState([]);

    useEffect(() => {
        if (data) {
            setRaid(data?.raid_name);
            setPlayersToSubmit(
                data?.players_list.map(player => ({ name: player, is_selected: true }))
            );
        }
    }, [data]);

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;
    if (!isSuperUser) return <>Unauthorized.</>;

    const handleTextInput = e => {
        if (e.key === 'enter') return e.preventDefault();
        setRaid(e.target.value);
    };

    const handleSubmit = _ => {
        if (!raid) return;
        if (playersToSubmit.length === 0) return;

        const playersToSubmitCopy = [...playersToSubmit];
        const _getTruthyPlayersToSubmit = playersToSubmitCopy.filter(p => p.is_selected === true);

        const payload = {
            raid_name: raid,
            players_list: _getTruthyPlayersToSubmit.map(player => player.name),
        };

        mutate({ payload });
    };

    return (
        <Container sx={{ marginTop: 5 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mr: 1,
                }}
            >
                <DataField label="Created At" value={data.created_at} sx={{ margin: 2 }} />
                <DataField label="Attendees" value={playersToSubmit.length} sx={{ margin: 2 }} />
            </Box>
            <AddPlayerField
                playersToSubmit={playersToSubmit}
                setPlayersToSubmit={setPlayersToSubmit}
            />
            <Box sx={{ ...fieldCardStyles, display: 'flex', marginBottom: 2, marginTop: 2 }}>
                <TextField
                    label="Raid Name"
                    fullWidth
                    size="small"
                    sx={{ ...textFieldStyles, flex: 1 }}
                    value={raid}
                    onChange={handleTextInput}
                />
                <button
                    style={{ marginLeft: 38, backgroundColor: '#2a2a2a' }}
                    onClick={handleSubmit}
                    disabled={!raid || playersToSubmit.length === 0}
                >
                    APPROVE
                </button>
            </Box>
            <PlayersToSubmitTable
                playersToSubmit={playersToSubmit}
                setPlayersToSubmit={setPlayersToSubmit}
            />
        </Container>
    );
}
