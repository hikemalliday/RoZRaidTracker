import { useParams } from 'react-router';
import { useDetail, useRaidAttendanceApprovalMutation } from '../hooks/requests.js';
import { Button, Table, TableBody, TableCell, TableRow, TextField } from '@mui/material';
import { useState } from 'react';
import { buttonStyles } from '../styles.js';

export function ApprovalDetailView() {
    const { id } = useParams();
    const { isPending, data, error } = useDetail(
        'raid_attendance_approval',
        '/raid_attendance_approval/',
        id
    );
    const { mutate } = useRaidAttendanceApprovalMutation(id);
    const [raid, setRaid] = useState('');

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;

    const submitApproval = async () => {
        const payload = {
            raid_name: raid,
            players: data?.players_list,
        };
        mutate({ payload });
    };

    const getPlayersRows = players => {
        return players.map((player, i) => {
            return (
                <TableRow
                    key={i}
                    sx={{
                        '& .MuiTableCell-root': {
                            padding: '4px',
                            color: 'white',
                        },
                        height: '36px',
                    }}
                >
                    <TableCell sx={{ color: 'white' }}>{player}</TableCell>
                </TableRow>
            );
        });
    };

    const handleTextInput = e => {
        if (e.key === 'enter') return e.preventDefault();
        setRaid(e.target.value);
    };

    return (
        <>
            <TextField
                label="Raid Name"
                color="secondary"
                sx={{
                    '& .MuiInputBase-input': {
                        color: 'white',
                    },
                    '& .MuiInputBase-root': {
                        backgroundColor: '#333333',
                        borderRadius: '8px',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                        borderWidth: '2px',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                    },
                    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white !important',
                    },
                    '& .MuiInputLabel-root': {
                        color: 'white',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: 'white',
                    },
                }}
                onChange={handleTextInput}
            />
            <Table sx={{ marginBottom: '20px', marginTop: '20px' }}>
                <TableBody>{getPlayersRows(data.players_list)}</TableBody>
            </Table>
            <Button
                sx={{ ...buttonStyles, paddingLeft: 1.5, paddingRight: 1.5 }}
                onClick={submitApproval}
            >
                APPROVE
            </Button>
        </>
    );
}
