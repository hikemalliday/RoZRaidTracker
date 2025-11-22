import { useParams } from 'react-router';
import {
    useDetail,
    useList,
    useListDebounced,
    useRaidAttendanceApprovalMutation,
} from '../hooks/requests.js';
import {
    Autocomplete,
    Button,
    Container,
    Table,
    TableBody,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { buttonStyles } from '../styles.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { v4 as uuidv4 } from 'uuid';
import { getCell } from '../components/Tables.jsx';
import { useAuthContext } from '../context/AuthContext.jsx';

const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
        width: 600,
        color: 'white',
        '& fieldset': {
            borderColor: 'rgba(255,255,255,0.4)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(255,255,255,0.7)',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#66b2ff', // same as MUI docs
            borderWidth: 2,
        },
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(255,255,255,0.7)',
    },
    '& label.Mui-focused': {
        color: '#66b2ff',
    },
};

const listBoxStyles = {
    backgroundColor: '#121212',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.2)',
    '& .MuiAutocomplete-option': {
        padding: '8px 12px',
        '&.Mui-focused': {
            backgroundColor: 'rgba(255,255,255,0.12)',
        },
        '&.Mui-selected': {
            backgroundColor: 'rgba(102,178,255,0.25)',
        },
        '&.Mui-selected:hover': {
            backgroundColor: 'rgba(102,178,255,0.35)',
        },
    },
};

// TODO: Dev notes:
// In this file, in order to handle the dynamically generated fields, we pass an object 'fieldsResults' to all rendered children,
// and we also use UUID's for each field to use as a key to mutate said object. Best I could come up with.

function ItemAwardedField({ fieldsResults, fieldKey }) {
    /* 'fieldsResults' prop is the 'form' data object, so to speak, passed down from the parent.
     * The selected option will be stored in this object, and then ultimately posted to the backend.
     * 'fieldKey' prop is string UUID and is necessary so that we can save the selected field in the 'fieldResults object',
     * and have a way to differentiate from the other rendered 'SearchableField' components.
     * */
    const [itemValue, setItemValue] = useState('');
    const debounced = useDebounce(itemValue || '', 300);
    const { data: itemsData, isPending: isItemsPending } = useListDebounced(
        'items',
        '/items/',
        'name',
        debounced
    );
    const { data: playersData, isPending: isPlayersPending } = useList('players', '/players/');

    const _getReducedResults = results => {
        if (!results) return [];
        return results.map(res => {
            return { id: res.id, label: res.name };
        });
    };

    const _sortReducedList = results => {
        return results.sort((a, b) => {
            const valA = a.label;
            const valB = b.label;
            return valA.localeCompare(valB);
        });
    };

    const getPlayersListFinal = results => {
        const reducedList = _getReducedResults(results);
        return _sortReducedList(reducedList);
    };

    return (
        <Container
            sx={{
                display: 'flex',
            }}
        >
            <Autocomplete
                renderInput={params => <TextField {...params} label="Item" sx={textFieldStyles} />}
                options={!isItemsPending ? _getReducedResults(itemsData.results) : []}
                filterOptions={x => x}
                onInputChange={(event, newInputValue) => {
                    setItemValue(newInputValue);
                }}
                inputValue={itemValue}
                slotProps={{ listbox: { sx: listBoxStyles } }}
                onChange={(_, option) => {
                    if (!fieldsResults.current[fieldKey]) fieldsResults.current[fieldKey] = {};
                    fieldsResults.current[fieldKey].item = option;
                }}
            />
            <Autocomplete
                renderInput={params => (
                    <TextField {...params} label="Player" sx={textFieldStyles} />
                )}
                options={!isPlayersPending ? getPlayersListFinal(playersData.results) : []}
                onChange={(_, option) => {
                    if (!fieldsResults.current[fieldKey]) fieldsResults.current[fieldKey] = {};
                    fieldsResults.current[fieldKey].player = option;
                }}
            />
        </Container>
    );
}

export function ApprovalDetailView() {
    const { isSuperUser } = useAuthContext();
    const { id } = useParams();
    const fieldsResults = useRef({});
    const [itemAwardedFields, setItemAwardedFields] = useState({});
    const { isPending, data, error } = useDetail(
        'raid_attendance_approval',
        '/raid_attendance_approval/',
        id
    );
    const { mutate } = useRaidAttendanceApprovalMutation(id);
    const [raid, setRaid] = useState('');
    const [playersToSubmit, setPlayersToSubmit] = useState([]);

    useEffect(() => {
        setRaid(data?.raid_name);
        setPlayersToSubmit(data?.players_list);
    }, [data]);

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;
    if (!isSuperUser) return <>Unauthorized.</>;

    const getPlayersRows = players => {
        const _getPlayerCheckbox = player => {
            const _handleCheckboxClick = e => {
                const newPlayersToSubmit = [...playersToSubmit];
                if (e.target.checked) {
                    return setPlayersToSubmit([...newPlayersToSubmit, player]);
                }
                return setPlayersToSubmit(
                    newPlayersToSubmit.filter(plyr => {
                        return plyr !== player;
                    })
                );
            };

            return (
                <input
                    type="checkbox"
                    defaultChecked
                    onChange={e => _handleCheckboxClick(e, player)}
                />
            );
        };

        return players.map((player, i) => {
            return (
                <TableRow
                    sx={{
                        '& .MuiTableCell-root': {
                            padding: '4px',
                        },
                        height: '36px',
                    }}
                    key={i}
                >
                    {getCell(player)}
                    {getCell(_getPlayerCheckbox(player))}
                </TableRow>
            );
        });
    };

    const handleTextInput = e => {
        if (e.key === 'enter') return e.preventDefault();
        setRaid(e.target.value);
    };

    const removeField = (e, fieldKey) => {
        delete fieldsResults.current[fieldKey];
        setItemAwardedFields(prev => {
            const newState = { ...prev };
            delete newState[fieldKey];
            return newState;
        });
    };

    const addItemAwardedField = () => {
        const fieldKey = uuidv4();
        const field = (
            <Container sx={{ display: 'flex' }} key={fieldKey}>
                <button onClick={_ => removeField(_, fieldKey)}>-</button>
                <ItemAwardedField fieldsResults={fieldsResults} fieldKey={fieldKey} />
            </Container>
        );
        setItemAwardedFields(prev => {
            return { ...prev, [fieldKey]: field };
        });
    };

    // TODO: We might want to reduce our 'fieldsResults' objects so that the backend doesn't have to deal with it
    const handleSubmit = _ => {
        if (!raid) return;
        if (playersToSubmit.length === 0) return;

        const payload = {
            raid_name: raid,
            players_list: playersToSubmit,
        };
        const itemsAwarded = Object.values(fieldsResults.current).map(itemAwarded => itemAwarded);
        if (itemsAwarded) payload.items_awarded = itemsAwarded;
        mutate({ payload });
    };

    return (
        <Container sx={{ marginTop: 5 }}>
            {Object.keys(itemAwardedFields).length
                ? Object.values(itemAwardedFields).map(field => field)
                : null}
            <button onClick={addItemAwardedField}>ADD ITEM</button>
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
                    value={raid}
                    onChange={handleTextInput}
                />
                <Button
                    sx={{ ...buttonStyles, paddingLeft: 1.5, paddingRight: 1.5, width: '225px' }}
                    onClick={handleSubmit}
                    disabled={!raid || playersToSubmit.length === 0}
                >
                    APPROVE
                </Button>
            </Container>
            <Typography sx={{ mt: 1 }}>
                Created at: <span style={{ fontWeight: 'bold' }}>{data.created_at}</span>
            </Typography>
            <Typography sx={{ mt: 2 }}>ATTENDEES:</Typography>
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
        </Container>
    );
}
