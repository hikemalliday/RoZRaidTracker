import {
    Autocomplete,
    Box,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material';
import { Link } from 'react-router';
import React, { useEffect, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce.js';
import { useListDebounced } from '../hooks/requests.js';
import { listBoxStyles, textFieldStyles } from '../styles.js';
import { _getReducedResults, getLootType } from '../views/utils.jsx';
const IMAGE_PATH = import.meta.env.VITE_IMAGE_PATH;


export const LinkCell = ({ val, route, extraText }) => {
    return (
        <TableCell id="clickable-cell">
            <Link to={route}>{val}</Link>
            <span id={extraText?.id}>{extraText?.text}</span>
        </TableCell>
    );
};

export const CellNonClickable = ({ val }) => {
    return <TableCell id="non-clickable-cell">{val}</TableCell>;
};

export const ItemIconCell = ({ iconId }) => {
    return (
        <TableCell id="non-clickable-cell">
            <img id="item-icon" src={`${IMAGE_PATH}/item_${iconId}.png`} alt={'null'} />
        </TableCell>
    );
};

export const CheckboxCell = ({ changeHandler }) => {
    return (
        <TableCell>
            <input type="checkbox" onChange={e => changeHandler(e)} />
        </TableCell>
    );
};

export const LootTypeBadgeCell = ({ lootType }) => {
    const styles_map = {
        "preferred": {
            background: 'rgba(234, 179, 8, 0.15)',
            color: '#facc15',
            border: '1px solid rgba(234, 179, 8, 0.3)',
        },
        "preferred_magelo": {
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#fbbf24',
            border: '1px solid rgba(245, 158, 11, 0.3)',
        },
        "main_magelo": {
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#f87171',
            border: '1px solid rgba(239, 68, 68, 0.3)',
        },
        "alt_magelo": {
            background: 'rgba(249, 115, 22, 0.15)',
            color: '#fb923c',
            border: '1px solid rgba(249, 115, 22, 0.3)',
        },
        "alt": {
            background: 'rgba(139, 92, 246, 0.15)',
            color: '#a78bfa',
            border: '1px solid rgba(139, 92, 246, 0.3)',
        },
        "main": {
            background: 'rgba(107, 114, 128, 0.15)',
            color: '#9ca3af',
            border: '1px solid rgba(107, 114, 128, 0.3)',
        },
        "main_alt": {
            background: 'rgba(139, 92, 246, 0.15)',
            color: '#a78bfa',
            border: '1px solid rgba(139, 92, 246, 0.3)',
        }
    }
    const badgeStyle = styles_map[lootType];

    if (!badgeStyle) {
        return <TableCell id="non-clickable-cell">{lootType}</TableCell>;
    }

    return (
        <TableCell id="non-clickable-cell">
            <Box
                sx={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: badgeStyle.border,
                    background: badgeStyle.background,
                    color: badgeStyle.color,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                    letterSpacing: '0.3px',
                }}
            >
                {lootType}
            </Box>
        </TableCell>
    );
};

// Order of keys in 'headerMap' matters, as the keys are used for rendering cols / headers
export function TableList({
    data,
    getTableRows,
    headerMap = {},
    headerAlign = {},
    sortable = false,
    dataTestId = null,
}) {
    const [sorted, setSorted] = useState(data);
    const [sortDirection, setSortDirection] = useState('asc');
    const reducedData = getTableRows(sorted);

    useEffect(() => {
        setSorted(data);
    }, [data]);

    const _getNestedValue = (obj, path) => {
        return path.split('.').reduce((current, key) => {
            return current && typeof current === 'object' ? current[key] : undefined;
        }, obj);
    };

    const _sortByCol = header => {
        if (!header) return;
        const colToSortBy = headerMap[header];

        if (!colToSortBy) return;

        const newSorted = [...sorted].sort((a, b) => {
            const valA = _getNestedValue(a, colToSortBy);
            const valB = _getNestedValue(b, colToSortBy);

            if (valA == null || valB == null) {
                return valA == null ? 1 : -1;
            }

            const sortMapString = {
                asc: () => {
                    setSortDirection('desc');
                    return valB.localeCompare(valA);
                },
                desc: () => {
                    setSortDirection('asc');
                    return valA.localeCompare(valB);
                },
            };

            const sortMapNumber = {
                asc: () => {
                    setSortDirection('desc');
                    return valB - valA;
                },
                desc: () => {
                    setSortDirection('asc');
                    return valA - valB;
                },
            };

            const dataType = typeof valA;
            return dataType === 'string'
                ? sortMapString[sortDirection]()
                : sortMapNumber[sortDirection]();
        });
        return setSorted(newSorted);
    };

    const _getHeaderId = header => {
        const headerMapVal = headerMap[header];
        return headerMapVal && sortable ? 'table-header-sortable' : 'table-header';
    };

    return (
        <Table
            sx={{
                width: '100%',
                borderCollapse: 'collapse',
            }}
            data-testid={dataTestId ? `table-list-${dataTestId}` : `table-list-test-id`}
        >
            <TableHead>
                <TableRow>
                    {Object.keys(headerMap).map((header, i) => {
                        return (
                            <TableCell
                                key={i}
                                id={_getHeaderId(header)}
                                align={headerAlign[header] || 'left'}
                                onClick={() => (sortable ? _sortByCol(header) : null)}
                            >
                                {header}
                            </TableCell>
                        );
                    })}
                </TableRow>
            </TableHead>
            <TableBody>
                {reducedData.map(row => {
                    return row;
                })}
            </TableBody>
        </Table>
    );
}
// TODO: Below are field components used for RaidEditView. Each component follows a pattern of taking in a 'formObject', this way the parent component has access to the mutated state.
export function ItemAwardedNameEditableField({ formObject, itemAwardedDetail }) {
    const itemAwardedId = itemAwardedDetail.id;
    const itemId = itemAwardedDetail.item.id;
    const itemName = itemAwardedDetail.item.name;
    const itemOption = { id: itemId, label: itemName };

    const [itemValue, setItemValue] = useState(itemName);
    const debounced = useDebounce(itemValue || '', 300);
    const [selectedItem, setSelectedItem] = useState(itemOption);
    const { data: itemsData, isPending: isItemsPending } = useListDebounced(
        'items',
        '/items/',
        'name',
        debounced
    );

    return (
        <TableCell>
            <Autocomplete
                sx={{ flex: 1 }}
                disableClearable
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Item"
                        sx={{ ...textFieldStyles, width: 300 }}
                        size="small"
                    />
                )}
                options={!isItemsPending ? _getReducedResults(itemsData) : []}
                getOptionLabel={option => option?.label || ''} // Tells the component to get the label from the 'label' key.
                filterOptions={x => x} // Not sure why we do this
                onInputChange={(event, newInputValue) => {
                    setItemValue(newInputValue); // Related to the text that the user actually sees, not the true value inside the form.
                }}
                inputValue={itemValue} // What the user sees in the auto complete field. Coupled with 'onInputChange'
                value={selectedItem} // Actual value inside the form. Couple with onChange.
                slotProps={{ listbox: { sx: listBoxStyles } }}
                onChange={(_, option) => {
                    setSelectedItem(option);
                    formObject.current[itemAwardedId].item = option?.id || null;
                    formObject.current[itemAwardedId].dirty = true;
                }}
            />
        </TableCell>
    );
}

export function ItemAwardedPlayerEditableField({ formObject, playersOptions, itemAwardedDetail }) {
    const playerId = itemAwardedDetail.player.id;
    const playerName = itemAwardedDetail.player.name;
    const itemAwardedId = itemAwardedDetail.id;
    const playerOption = { id: playerId, label: playerName };
    const [selectedPlayer, setSelectedPlayer] = useState(playerOption);
    const [playerValue, setPlayerValue] = useState(playerName);

    return (
        <TableCell>
            <Autocomplete
                disableClearable
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Player"
                        sx={{ ...textFieldStyles, width: 200 }}
                        size="small"
                    />
                )}
                options={playersOptions || []}
                getOptionLabel={option => option?.label || ''}
                inputValue={playerValue}
                value={selectedPlayer}
                onInputChange={(event, newInputValue) => {
                    setPlayerValue(newInputValue);
                }}
                onChange={(_, option) => {
                    setSelectedPlayer(option);
                    formObject.current[itemAwardedId].player = option?.id || null;
                    formObject.current[itemAwardedId].dirty = true;
                }}
            />
        </TableCell>
    );
}

export function ItemAwardedTypeEditableField({ formObject, itemAwardedDetail }) {
    const initialLootType = getLootType(itemAwardedDetail);

    const [lootType, setLootType] = useState(initialLootType);

    const lootTypeOptions = [
        'Preferred',
        'Preferred, Magelo',
        'Main, Magelo',
        'Main',
        'Alt, Magelo',
        'Alt',
        'Main Alt',
    ];

    const handleChange = event => {
        const value = event.target.value;
        setLootType(value);
        formObject.current[itemAwardedDetail.id].dirty = true;
        formObject.current[itemAwardedDetail.id].lootType = value;
    };

    return (
        <TableCell>
            <Select
                size="small"
                fullWidth
                value={lootType}
                onChange={handleChange}
                variant="outlined"
                sx={{
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
                {lootTypeOptions.map(option => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
        </TableCell>
    );
}
