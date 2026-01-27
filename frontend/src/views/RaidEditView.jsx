import { useParams } from 'react-router';
import {
    useItemAwardedCreate,
    useItemAwardedDelete,
    useItemAwardedEdit,
    useItemsAwardedList,
    useListDebounced,
    usePlayersList,
    useRaidAttendanceDelete,
    useRaidAttendanceList,
    useRaidAttendanceMutation,
    useRaidDetail,
} from '../hooks/requests.js';
import { useAuthContext } from '../context/AuthContext.jsx';
import {
    Autocomplete,
    Box,
    Container,
    TableCell,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { _getReducedResults, getPlayersListFinal, renderErrors } from './utils.jsx';
import React, { useEffect, useRef, useState } from 'react';
import {
    dataLabel,
    get21DayStyles,
    labelStyles,
    listBoxStyles,
    tableBox,
    textFieldStyles,
} from '../styles.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { ItemAwardedListTableEditable } from '../components/ItemAwardedListTableEditable.jsx';
import {
    getCell,
    getCheckboxCell,
    getItemIconCell,
    getLinkCell,
    ItemAwardedNameEditableField,
    ItemAwardedPlayerEditableField,
    ItemAwardedTypeEditableField,
    TableList,
} from '../components/Tables.jsx';

function AddItemAwardedField({ raidId, styles = {} }) {
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
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                padding: '20px',
                width: 'calc(100% + 80px)',
                marginLeft: '-20px',
                marginRight: '-20px',
                boxSizing: 'border-box',
                mt: 2,
                mb: 1,
                ...styles,
            }}
        >
            <Typography
                sx={{
                    color: '#9ca3af',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '12px',
                }}
            >
                Add Item
            </Typography>
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

function AddPlayerField({ raidId, styles = {} }) {
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
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                padding: '20px',
                width: 'calc(100% + 80px)',
                marginLeft: '-20px',
                marginRight: '-20px',
                boxSizing: 'border-box',
                ...styles,
            }}
        >
            <Typography
                sx={{
                    color: '#9ca3af',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '12px',
                }}
            >
                Add Attendee
            </Typography>
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
                    options={!isPlayersPending ? getPlayersListFinal(playersData.results) : []}
                    onChange={(_, option) => {
                        setSelectedPlayer(option.id);
                    }}
                />
                <button onClick={handleSubmit}>ADD PLAYER</button>
            </Box>
        </Box>
    );
}

export function RemoveSelectedPlayersTable({ playersToRender, formObject, onSubmit, ...rest }) {
    const _handleCheckbox = (e, raId) => {
        if (e.target.checked) {
            return formObject.current.push(raId);
        }
        formObject.current = formObject.current.filter(p => p !== raId);
    };

    const getPlayersToRemoveRows = data => {
        return data.map(row => {
            return (
                <TableRow key={row?.id} sx={get21DayStyles(row)}>
                    {getCell(row?.name)}
                    <TableCell align="right">
                        <input type="checkbox" onChange={e => _handleCheckbox(e, row?.id)} />
                    </TableCell>
                </TableRow>
            );
        });
    };

    // Null vals means col is not sortable (frontend table sorting)
    const headerMap = {
        Name: 'player.name',
        Remove: null,
    };
    const headerAlign = {
        Remove: 'right',
    };
    if (!playersToRender) return <></>;
    return (
        <>
            <TableList
                headerMap={headerMap}
                headerAlign={headerAlign}
                data={playersToRender}
                getTableRows={getPlayersToRemoveRows}
                styledRows={false}
                {...rest}
            />
            <button
                style={{
                    display: 'flex',
                    alignItems: 'left',
                    marginTop: 5,
                }}
                onClick={onSubmit}
            >
                REMOVE SELECTED
            </button>
        </>
    );
}

export function RaidEditView() {
    const { id } = useParams();
    const { isSuperUser } = useAuthContext();
    const { isPending, data, error } = useRaidDetail(id);
    const {
        isPending: isRaPending,
        data: raData,
        error: raError,
    } = useRaidAttendanceList({ raid: id });
    const {
        isPending: isItemAwardedPending,
        data: itemAwardedData,
        error: itemAwardedError,
    } = useItemsAwardedList({ raid: id });
    const { mutate } = useRaidAttendanceDelete();
    const [playersToRender, setPlayersToRender] = useState([]);
    const raRowsToDelete = useRef([]);

    const pendingList = [isPending, isRaPending, isItemAwardedPending];
    const errorList = [error, raError, itemAwardedError];

    useEffect(() => {
        const playersList = raData?.results
            .map(ra => {
                return { name: ra.player.name, id: ra.id };
            })
            .sort((a, b) => {
                return a.name.localeCompare(b.name);
            });

        setPlayersToRender(playersList);
    }, [raData]);

    if (pendingList.some(Boolean)) return <>LOADING...</>;
    if (errorList.some(Boolean)) return <>{renderErrors(errorList)}</>;
    if (!isSuperUser) return <>Unauthorized.</>;
    if (!playersToRender) return <>LOADING...</>;

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
                <Box
                    sx={{
                        textAlign: 'center',
                        marginBottom: '40px',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '40px',
                        }}
                    >
                        <Box>
                            <Box sx={dataLabel}>Raid</Box>
                            <Box sx={{ color: '#fff', fontWeight: 600 }}>{data?.name}</Box>
                        </Box>
                        <Box>
                            <Box sx={dataLabel}>Date</Box>
                            <Box sx={{ color: '#fff', fontWeight: 600 }}>{data?.created_at}</Box>
                        </Box>
                    </Box>
                </Box>
            </Container>
            <AddItemAwardedField raidId={id} />
            {itemAwardedData.results.length > 0 && (
                <Box sx={tableBox}>
                    <ItemAwardedListTableEditable
                        data={itemAwardedData.results}
                        styledRows={true}
                    />
                </Box>
            )}
            <Box sx={{ mb: 3 }}>
                <Box sx={dataLabel}>Attendees</Box>
                <Box sx={{ color: '#fff', fontWeight: 600 }}>{raData.count}</Box>
            </Box>
            <AddPlayerField raidId={id} styles={{ mb: 2 }} />
            <Box sx={tableBox}>
                <RemoveSelectedPlayersTable
                    playersToRender={playersToRender}
                    formObject={raRowsToDelete}
                    onSubmit={handleRemovePlayersSubmit}
                />
            </Box>
        </Container>
    );
}
