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
import { buttonStyles, listBoxStyles, textFieldStyles } from '../styles.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { v4 as uuidv4 } from 'uuid';
import { getCell } from '../components/Tables.jsx';
import { useAuthContext } from '../context/AuthContext.jsx';
import { getPlayersListFinal, _getReducedResults } from './utils.jsx';

// TODO: Theres a 'key' render warning in this view, not really sure how to fix it given the way I decoded to render some of the fields
// TODO: Dev notes:
// In this file, in order to handle the dynamically generated fields, we pass an object 'fieldsResults' to all rendered children,
// and we also use UUID's for each field to use as a key to mutate said object. Best I could come up with.

// function ItemAwardedField({ fieldsResults, fieldKey }) {
//     /* 'fieldsResults' prop is the 'form' data object, so to speak, passed down from the parent.
//      * The selected option will be stored in this object, and then ultimately posted to the backend.
//      * 'fieldKey' prop is string UUID and is necessary so that we can save the selected field in the 'fieldResults object',
//      * and have a way to differentiate from the other rendered 'SearchableField' components.
//      * */
//     const [itemValue, setItemValue] = useState('');
//     const debounced = useDebounce(itemValue || '', 300);
//     const { data: itemsData, isPending: isItemsPending } = useListDebounced(
//         'items',
//         '/items/',
//         'name',
//         debounced
//     );
//     const { data: playersData, isPending: isPlayersPending } = useList('players', '/players/');
//
//     const _sortReducedList = results => {
//         return results.sort((a, b) => {
//             const valA = a.label;
//             const valB = b.label;
//             return valA.localeCompare(valB);
//         });
//     };
//
//     const getPlayersListFinal = results => {
//         const reducedList = _getReducedResults(results);
//         return _sortReducedList(reducedList);
//     };
//
//     const _handleAltLootCheckBox = e => {
//         return (fieldsResults.current[fieldKey].alt_loot = !!e.target.checked);
//     };
//
//     const _handlePreferredCheckBox = e => {
//         return (fieldsResults.current[fieldKey].preferred = !!e.target.checked);
//     };
//
//     return (
//         <Container
//             sx={{
//                 display: 'flex',
//             }}
//         >
//             <Autocomplete
//                 renderInput={params => <TextField {...params} label="Item" sx={textFieldStyles} />}
//                 options={!isItemsPending ? _getReducedResults(itemsData.results) : []}
//                 filterOptions={x => x}
//                 onInputChange={(event, newInputValue) => {
//                     setItemValue(newInputValue);
//                 }}
//                 inputValue={itemValue}
//                 slotProps={{ listbox: { sx: listBoxStyles } }}
//                 onChange={(_, option) => {
//                     if (!fieldsResults.current[fieldKey]) fieldsResults.current[fieldKey] = {};
//                     fieldsResults.current[fieldKey].item = option;
//                 }}
//             />
//             <Autocomplete
//                 renderInput={params => (
//                     <TextField {...params} label="Player" sx={textFieldStyles} />
//                 )}
//                 options={!isPlayersPending ? getPlayersListFinal(playersData.results) : []}
//                 onChange={(_, option) => {
//                     if (!fieldsResults.current[fieldKey]) fieldsResults.current[fieldKey] = {};
//                     fieldsResults.current[fieldKey].player = option;
//                 }}
//             />
//             <Container>
//                 <Typography>Alt Loot</Typography>
//                 <input type="checkbox" onChange={e => _handleAltLootCheckBox(e, player)} />
//             </Container>
//             <Container>
//                 <Typography>Preferred</Typography>
//                 <input type="checkbox" onChange={e => _handlePreferredCheckBox(e, player)} />
//             </Container>
//         </Container>
//     );
// }

function AddPlayerField({ playersToSubmit, setPlayersToSubmit, styles = {} }) {
    const { data: playersData, isPending: isPlayersPending } = useList('players', '/players/');
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const handleSubmit = () => {
        if (!selectedPlayer) return;
        if (playersToSubmit.some(p => p.name === selectedPlayer.name)) return;
        const newPlayersToSubmit = [...playersToSubmit];
        newPlayersToSubmit.unshift(selectedPlayer);
        return setPlayersToSubmit(newPlayersToSubmit);
    };

    return (
        <Container
            sx={{
                ...styles,
                display: 'flex',
            }}
        >
            <Autocomplete
                renderInput={params => (
                    <TextField {...params} label="Player" sx={textFieldStyles} size="small" />
                )}
                options={!isPlayersPending ? getPlayersListFinal(playersData.results) : []}
                onChange={(_, option) => {
                    setSelectedPlayer({ name: option.label, is_selected: true });
                }}
            />
            <button onClick={handleSubmit}>ADD PLAYER</button>
        </Container>
    );
}

export function ApprovalPendingDetailView() {
    const { id } = useParams();
    const { isSuperUser } = useAuthContext();
    const fieldsResults = useRef({});
    // const [itemAwardedFields, setItemAwardedFields] = useState({});
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
        setPlayersToSubmit(
            data?.players_list.map(player => {
                return { name: player, is_selected: true };
            })
        );
    }, [data]);

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;
    if (!isSuperUser) return <>Unauthorized.</>;

    const getPlayersRows = players => {
        const _getPlayerCheckbox = player => {
            const _handleCheckboxClick = e => {
                const newPlayersToSubmit = [...playersToSubmit];
                const playerToMutate = newPlayersToSubmit.filter(p => p.name === player.name);
                playerToMutate.is_selected = !!e.target.checked;
                return setPlayersToSubmit(newPlayersToSubmit);
            };

            return (
                <input
                    type="checkbox"
                    defaultChecked
                    onChange={e => _handleCheckboxClick(e, player)}
                />
            );
        };

        const sortedPlayers = players.sort((a, b) => {
            const valA = a.name;
            const valB = b.name;
            return valA.localeCompare(valB);
        });

        return sortedPlayers.map(player => {
            return (
                <TableRow
                    sx={{
                        '& .MuiTableCell-root': {
                            padding: '4px',
                        },
                        height: '36px',
                    }}
                    key={player.id}
                >
                    {getCell(player.name)}
                    {getCell(_getPlayerCheckbox(player))}
                </TableRow>
            );
        });
    };

    const handleTextInput = e => {
        if (e.key === 'enter') return e.preventDefault();
        setRaid(e.target.value);
    };
    // // TODO: 12/7: Related to items
    // const removeField = (e, fieldKey) => {
    //     delete fieldsResults.current[fieldKey];
    //     setItemAwardedFields(prev => {
    //         const newState = { ...prev };
    //         delete newState[fieldKey];
    //         return newState;
    //     });
    // };
    //
    // const addItemAwardedField = () => {
    //     const fieldKey = uuidv4();
    //     const field = (
    //         <Container sx={{ display: 'flex' }} key={fieldKey}>
    //             <button onClick={_ => removeField(_, fieldKey)}>-</button>
    //             <ItemAwardedField fieldsResults={fieldsResults} fieldKey={fieldKey} />
    //         </Container>
    //     );
    //     setItemAwardedFields(prev => {
    //         return { ...prev, [fieldKey]: field };
    //     });
    // };

    const handleSubmit = _ => {
        if (!raid) return;
        if (playersToSubmit.length === 0) return;

        const payload = {
            raid_name: raid,
            players_list: playersToSubmit.map(player => player.name),
        };
        // const itemsAwarded = Object.values(fieldsResults.current).map(itemAwarded => itemAwarded);
        // if (itemsAwarded) payload.items_awarded = itemsAwarded;
        mutate({ payload });
    };

    return (
        <Container sx={{ marginTop: 5 }}>
            {/*{Object.keys(itemAwardedFields).length*/}
            {/*    ? Object.values(itemAwardedFields).map(field => field)*/}
            {/*    : null}*/}
            {/*<button onClick={addItemAwardedField}>ADD ITEM</button>*/}

            <Container
                sx={{
                    marginTop: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    alignItems: 'center',
                }}
            >
                {
                    <AddPlayerField
                        styles={{ marginLeft: 20 }}
                        playersToSubmit={playersToSubmit}
                        setPlayersToSubmit={setPlayersToSubmit}
                    />
                }
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
                <TableBody>{getPlayersRows(playersToSubmit ?? [])}</TableBody>
            </Table>
        </Container>
    );
}
