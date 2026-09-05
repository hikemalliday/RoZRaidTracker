import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { usePlayersList, useRaidAttendanceMutation } from '../hooks/requests.js';
import { fieldCardStyles, fieldCardTypographyStyles, textFieldStyles } from '../styles.js';
import { getPlayersOptions } from '../views/utils.jsx';

export function AddPlayerField({ raidId, styles = {} }) {
    const { data: playersData, isPending: isPlayersPending } = usePlayersList();
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
        <Box
            sx={{
                ...fieldCardStyles,
                ...styles,
            }}
        >
            <Typography sx={fieldCardTypographyStyles}>Add Attendee</Typography>
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
                    options={!isPlayersPending ? getPlayersOptions(playersData) : []}
                    onChange={(_, option) => {
                        setSelectedPlayer(option.id);
                    }}
                />
                <button onClick={handleSubmit}>ADD PLAYER</button>
            </Box>
        </Box>
    );
}
