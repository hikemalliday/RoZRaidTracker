import { Autocomplete, Box, TextField, Typography, Button } from '@mui/material';
import React, { useState } from 'react';
import { usePlayersList, useRaidAttendanceMutation } from '../hooks/requests.js';
import { boxEffectStyles, buttonStyles, fieldCardStyles, fieldCardTypographyStyles, textFieldStyles } from '../styles.js';
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
                sx={boxEffectStyles}
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
                <Button sx={buttonStyles} onClick={handleSubmit}>ADD PLAYER</Button>
            </Box>
        </Box>
    );
}
