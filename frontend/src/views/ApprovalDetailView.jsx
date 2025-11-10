import { useParams } from 'react-router';
import { useDetail, useRaidAttendanceApprovalMutation } from '../hooks/requests.js';
import {
    Button,
    Container,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
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
    // TODO: PUSH puts at end, unShift puts at begginning?
    const getPlayersRows = players => {
        const _getTableRow = cells => (
            <TableRow
                sx={{
                    '& .MuiTableCell-root': {
                        padding: '4px',
                        color: 'white',
                    },
                    height: '36px',
                }}
            >
                {cells}
            </TableRow>
        );

        const results = [];
        let cellsArray = [];

        players.forEach((player, i) => {
            cellsArray.push(
                <TableCell key={i} sx={{ color: 'white' }}>
                    {player}
                </TableCell>
            );

            if (cellsArray.length === 10 || i === players.length - 1) {
                results.push(_getTableRow(cellsArray));
                cellsArray = [];
            }
        });

        return results;
    };

    const handleTextInput = e => {
        if (e.key === 'enter') return e.preventDefault();
        setRaid(e.target.value);
    };
    return (
        <>
            <Container
                sx={{
                    marginTop: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    alignItems: 'center',
                }}
            >
                <TextField
                    label="Raid Name"
                    color="secondary"
                    sx={{
                        width: '225px',
                        marginLeft: 0.5,
                        '& .MuiInputBase-input': {
                            color: 'white',
                        },
                        '& .MuiInputBase-root': {
                            backgroundColor: '#333333',
                            borderRadius: '8px',
                            height: '40px',
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
                <Button
                    sx={{ ...buttonStyles, paddingLeft: 1.5, paddingRight: 1.5, width: '225px' }}
                    onClick={submitApproval}
                >
                    APPROVE
                </Button>
            </Container>
            <Typography sx={{ mt: 1 }}>
                Created at: <span style={{ fontWeight: 'bold' }}>{data.created_at}</span>
            </Typography>
            <Table
                sx={{
                    marginBottom: '20px',
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <TableBody>{getPlayersRows(data.players_list)}</TableBody>
            </Table>
        </>
    );
}
