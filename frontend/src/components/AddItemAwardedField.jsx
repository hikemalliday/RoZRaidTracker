import { Autocomplete, Box, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useItemAwardedCreate, useListDebounced, usePlayersList } from '../hooks/requests.js';
import {
    fieldCardStyles,
    fieldCardTypographyStyles,
    listBoxStyles,
    textFieldStyles,
} from '../styles.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { _getReducedResults, getPlayersOptions } from '../views/utils.jsx';

export function AddItemAwardedField({ raidId, styles = {} }) {
    const [itemValue, setItemValue] = useState('');
    const debounced = useDebounce(itemValue || '', 300);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const { data: playersData, isPending: isPlayersPending } = usePlayersList();
    const { data: itemsData, isPending: isItemsPending } = useListDebounced(
        'items',
        '/items/',
        'name',
        debounced
    );
    const { mutate } = useItemAwardedCreate();
    const [lootType, setLootType] = useState("Main");

    const lootTypeMap = {
        'Preferred': "preferred",
        'Preferred, Magelo': "preferred_magelo",
        'Main, Magelo': "main_magelo",
        'Main': "main",
        'Alt, Magelo': "alt_magelo",
        'Alt': "alt",
        "Main Alt": "main_alt",
    };

    const handleSubmit = () => {
        const payload = {
            raid_id: raidId,
            player_id: selectedPlayer,
            item_id: selectedItem,
            type: lootTypeMap[lootType],
        };
        mutate({ payload });
    };

    const handleChange = event => {
        const value = event.target.value;
        setLootType(value);
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
                    options={!isPlayersPending ? getPlayersOptions(playersData.results) : []}
                    onChange={(_, option) => {
                        setSelectedPlayer(option.id);
                    }}
                />
                <Select
                    size="small"
                    fullWidth
                    value={lootType}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{
                        width: '150px',
                        color: 'white', // text color
                        '.MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                        },
                        '.MuiSvgIcon-root': {
                            color: 'white', // dropdown arrow
                        },
                    }}
                >
                    {Object.keys(lootTypeMap).map(option => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
                <button style={{ whiteSpace: 'nowrap' }} onClick={handleSubmit}>
                    ADD ITEM
                </button>
            </Box>
        </Box>
    );
}
