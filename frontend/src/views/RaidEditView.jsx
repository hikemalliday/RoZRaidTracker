import { useParams } from 'react-router';
import {
    useDetail,
    useItemAwardedCreate,
    useItemsAwardedList,
    useListDebounced,
    usePlayersList,
    useRaidAttendanceDelete,
    useRaidAttendanceList,
    useRaidAttendanceMutation,
} from '../hooks/requests.js';
import { useAuthContext } from '../context/AuthContext.jsx';
import { Autocomplete, Box, Container, TextField, Typography } from '@mui/material';
import { _getReducedResults, getPlayersListFinal, renderErrors } from './utils.jsx';
import { useEffect, useRef, useState } from 'react';
import { listBoxStyles, textFieldStyles } from '../styles.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { ItemAwardedListTableEditable } from '../components/ItemAwardedListTableEditable.jsx';

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
                maxWidth: 900,
                mx: 'auto',
                ...styles,
            }}
        >
            <Autocomplete
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
                    setSelectedPlayer(option.id);
                }}
            />
            <button onClick={handleSubmit}>ADD PLAYER</button>
        </Container>
    );
}

// TODO: These are the "player name + checkbox" inputs
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

export function RaidEditView() {
    const { id } = useParams();
    const { isSuperUser } = useAuthContext();
    const { isPending, data, error } = useDetail('raids', '/raids/', id);
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
                return [ra.player.name, ra.id];
            })
            .sort((a, b) => {
                return a[0].localeCompare(b[0]);
            });

        setPlayersToRender(playersList);
    }, [raData]);

    if (pendingList.some(Boolean)) return <>LOADING...</>;
    if (errorList.some(Boolean)) return <>{renderErrors(errorList)}</>;
    if (!isSuperUser) return <>Unauthorized.</>;
    if (!playersToRender) return <>LOADING...</>;

    const getEditPlayerFields = () => {
        return playersToRender.map(([playerName, raId], i) => {
            return (
                <EditPlayerField
                    key={raId}
                    raRowsToDelete={raRowsToDelete}
                    playerName={playerName}
                    raId={raId}
                />
            );
        });
    };

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
                <Typography sx={{ mt: 1 }} variant="h5">
                    {data?.name}
                </Typography>
                <Typography>
                    <strong>Zone:</strong> {data?.zone?.name}
                </Typography>
                <strong>Date:</strong> {data?.created_at}
                <AddItemAwardedField raidId={id} />
            </Container>
            {itemAwardedData.results.length > 0 && (
                <ItemAwardedListTableEditable data={itemAwardedData.results} styledRows={true} />
            )}
            <Typography sx={{ mb: 2, mt: 4 }} variant="h6">
                Attendees - Total: {raData.count}
            </Typography>
            {<AddPlayerField raidId={id} />}
            <button
                style={{
                    display: 'flex',
                    alignItems: 'left',
                    marginTop: 5,
                }}
                onClick={handleRemovePlayersSubmit}
            >
                Remove Selected Players
            </button>
            {getEditPlayerFields()}
        </Container>
    );
}
