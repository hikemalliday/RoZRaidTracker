import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useItemAwardedCreate, useListDebounced, usePlayersList } from '../hooks/requests.js';
import {
    fieldCardStyles,
    fieldCardTypographyStyles,
    listBoxStyles,
    textFieldStyles,
} from '../styles.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { _getReducedResults, getPlayersListFinal } from '../views/utils.jsx';

export function AddItemAwardedField({ raidId, styles = {} }) {
    const [itemValue, setItemValue] = useState('');
    const debounced = useDebounce(itemValue || '', 300);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [altLoot, setAltLoot] = useState(false);
    const [preferred, setPreffered] = useState(false);
    const [magelo, setMagelo] = useState(false);
    const { data: playersData, isPending: isPlayersPending } = usePlayersList();
    const { data: itemsData, isPending: isItemsPending } = useListDebounced(
        'items',
        '/items/',
        'name',
        debounced
    );
    const { mutate } = useItemAwardedCreate();

    const handleSubmit = () => {
        const payload = {
            raid_id: raidId,
            player_id: selectedPlayer,
            item_id: selectedItem,
            alt_loot: altLoot,
            preferred: preferred,
            magelo: magelo,
        };
        mutate({ payload });
    };

    return (
        <Box
            sx={{
                ...fieldCardStyles,
                mt: 2,
                mb: 1,
                ...styles,
            }}
        >
            <Typography sx={fieldCardTypographyStyles}>Add Item</Typography>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                }}
            >
                <Autocomplete
                    sx={{ flex: 1 }}
                    renderInput={params => (
                        <TextField {...params} label="Item" sx={textFieldStyles} size="small" />
                    )}
                    options={!isItemsPending ? _getReducedResults(itemsData.results) : []}
                    filterOptions={x => x}
                    onInputChange={(event, newInputValue) => {
                        setItemValue(newInputValue);
                    }}
                    inputValue={itemValue}
                    slotProps={{ listbox: { sx: listBoxStyles } }}
                    onChange={(_, option) => {
                        setSelectedItem(option.id);
                    }}
                />
                <Autocomplete
                    sx={{ flex: 1 }}
                    renderInput={params => (
                        <TextField {...params} label="Player" sx={textFieldStyles} size="small" />
                    )}
                    options={!isPlayersPending ? getPlayersListFinal(playersData.results) : []}
                    onChange={(_, option) => {
                        setSelectedPlayer(option.id);
                    }}
                />
                <Box>
                    <Typography>Alt</Typography>
                    <input type="checkbox" onChange={e => setAltLoot(!!e.target.checked)} />
                </Box>
                <Box>
                    <Typography>Preferred</Typography>
                    <input type="checkbox" onChange={e => setPreffered(!!e.target.checked)} />
                </Box>
                <Box>
                    <Typography>Magelo</Typography>
                    <input type="checkbox" onChange={e => setMagelo(!!e.target.checked)} />
                </Box>
                <button style={{ whiteSpace: 'nowrap' }} onClick={handleSubmit}>
                    ADD ITEM
                </button>
            </Box>
        </Box>
    );
}
