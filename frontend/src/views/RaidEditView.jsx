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
import { Autocomplete, Box, Container, TableRow, TextField, Typography } from '@mui/material';
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
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                mt: 2,
                mb: 1,
                width: 'calc(100% + 80px)',
                marginLeft: '-20px',
                marginRight: '-20px',
                boxSizing: 'border-box',
                ...styles,
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
            <button style={{ whiteSpace: 'nowrap', marginBottom: '5px' }} onClick={handleSubmit}>
                ADD ITEM
            </button>
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
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
                width: 'calc(100% + 80px)',
                boxSizing: 'border-box',
                paddingRight: '17px',
                ...styles,
            }}
        >
            <Autocomplete
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Player"
                        sx={{ ...textFieldStyles, width: 500 }}
                        size="small"
                    />
                )}
                options={!isPlayersPending ? getPlayersListFinal(playersData.results) : []}
                onChange={(_, option) => {
                    setSelectedPlayer(option.id);
                }}
            />
            <button style={{ alignSelf: 'flex-start', marginLeft: 1 }} onClick={handleSubmit}>
                ADD PLAYER
            </button>
        </Box>
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

export function RemoveSelectedPlayersTable({ playersToRender, formObject, ...rest }) {
    const getPlayersToRemoveRows = data => {
        return data.map(row => {
            return (
                <TableRow key={row?.id} sx={get21DayStyles(row)}>
                    {getCell(row?.name)}
                    {getCheckboxCell(() => null)}
                </TableRow>
            );
        });
    };

    // Null vals means col is not sortable (frontend table sorting)
    const headerMap = {
        Name: 'player.name',
        Remove: null,
    };
    if (!playersToRender) return <></>;
    return (
        <>
            <TableList
                headerMap={headerMap}
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
                onClick={() => null}
            >
                Submit
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
                />
            </Box>
        </Container>
    );
}
