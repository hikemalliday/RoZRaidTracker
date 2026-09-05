import { useParams } from 'react-router';
import { useAuthContext } from '../context/AuthContext.jsx';
import { Autocomplete, Box, Container, MenuItem, Select, TableRow, TextField } from '@mui/material';
import {
    useCharacterBatchEdit,
    useCharacterCreate,
    useCharactersList,
} from '../hooks/requests.js';
import { renderErrors } from './utils.jsx';
import { useEffect, useState } from 'react';
import { getTextFieldStyles, textFieldStyles } from '../styles.js';
import {
    CellNonClickable,
    LinkCell,
    TableList,
} from '../components/Tables.jsx';

const CHARACTER_TYPE_OPTIONS = [
    { value: 'MAIN', label: 'Main' },
    { value: 'MAIN_ALT', label: 'Main Alt' },
    { value: 'ALT', label: 'Alt' },
];

const CHARACTER_TYPE_LABELS = Object.fromEntries(
    CHARACTER_TYPE_OPTIONS.map(({ value, label }) => [value, label])
);

function AddCharacterField({ playerId }) {
    const [charName, setCharName] = useState('');
    const [charClass, setCharClass] = useState('');
    const [charType, setCharType] = useState('ALT');
    const { mutate } = useCharacterCreate();

    const charOptions = [
        { id: 'BRD', label: 'Bard' },
        { id: 'BST', label: 'Beastlord' },
        { id: 'CLR', label: 'Cleric' },
        { id: 'DRU', label: 'Druid' },
        { id: 'ENC', label: 'Enchanter' },
        { id: 'MAG', label: 'Magician' },
        { id: 'MNK', label: 'Monk' },
        { id: 'NEC', label: 'Necromancer' },
        { id: 'PAL', label: 'Paladin' },
        { id: 'RNG', label: 'Ranger' },
        { id: 'ROG', label: 'Rogue' },
        { id: 'SHD', label: 'Shadow Knight' },
        { id: 'SHM', label: 'Shaman' },
        { id: 'WAR', label: 'Warrior' },
        { id: 'WIZ', label: 'Wizard' },
    ];

    const handleSubmit = () => {
        const payload = {
            name: charName,
            char_class: charClass,
            player_id: playerId,
            type: charType,
        };
        mutate({ payload });
    };

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                marginTop: 2,
                marginBottom: 2,
            }}
        >
            <TextField
                sx={textFieldStyles}
                label="Name"
                value={charName}
                onChange={e => setCharName(e.target.value)}
                size="small"
            />
            <Autocomplete
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Class"
                        sx={getTextFieldStyles(200)}
                        size="small"
                    />
                )}
                options={charOptions}
                onChange={(_, option) => {
                    setCharClass(option?.id ?? '');
                }}
            />
            <Autocomplete
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Type"
                        sx={getTextFieldStyles(200)}
                        size="small"
                    />
                )}
                options={CHARACTER_TYPE_OPTIONS}
                value={CHARACTER_TYPE_OPTIONS.find(option => option.value === charType) ?? null}
                onChange={(_, option) => {
                    setCharType(option?.value ?? 'ALT');
                }}
            />
            <button style={{ whiteSpace: 'nowrap' }} onClick={handleSubmit}>
                ADD CHARACTER
            </button>
        </Box>
    );
}

function EditableCharacterListTable({ charList }) {
    const [typeByCharacterId, setTypeByCharacterId] = useState({});
    const { mutate } = useCharacterBatchEdit();

    useEffect(() => {
        setTypeByCharacterId(
            Object.fromEntries(charList.map(char => [char.id, char.type]))
        );
    }, [charList]);

    const getCharacterRows = sorted => {
        return sorted.map((row, i) => {
            const characterType = typeByCharacterId[row.id] ?? row.type;

            return (
                <TableRow key={i}>
                    <CellNonClickable val={row?.name} />
                    <CellNonClickable val={row?.char_class} />
                    <CellNonClickable val={CHARACTER_TYPE_LABELS[row.type] ?? row.type} />
                    <LinkCell val={row?.player.name} route={`/player/${row?.player?.id}`} />
                    <CellNonClickable val={<Select
                        size="small"
                        fullWidth
                        value={characterType}
                        onChange={event => {
                            setTypeByCharacterId(current => ({
                                ...current,
                                [row.id]: event.target.value,
                            }));
                        }}
                        variant="outlined"
                        sx={{
                            width: '150px',
                            color: 'white',
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
                        {CHARACTER_TYPE_OPTIONS.map(({ value, label }) => (
                            <MenuItem key={value} value={value}>
                                {label}
                            </MenuItem>
                        ))}
                    </Select>} />
                </TableRow>
            );
        });
    };

    const handleEditCharactersBatchSubmit = () => {
        mutate({ payload: typeByCharacterId });
    }

    // Null vals here means cols are not sortable
    const headerMap = {
        Name: null,
        Class: null,
        Status: null,
        Player: null,
        Type: null,
    };
    return (
        <>
            <TableList data={charList} getTableRows={getCharacterRows} headerMap={headerMap} />
            <button
                style={{
                    display: 'flex',
                    marginTop: 10,
                }}
                onClick={handleEditCharactersBatchSubmit}
            >
                SAVE
            </button>
        </>
    );
}

export function PlayerEditView() {
    const { id } = useParams();
    const { isSuperUser } = useAuthContext();
    const {
        data: charListData,
        isPending: isCharsPending,
        error: charListError,
    } = useCharactersList({
        player: id,
    });
    if (!isSuperUser) return <>Unauthorized.</>;
    if (isCharsPending) return <>LOADING...</>;
    if (charListError) renderErrors([charListError]);

    return (
        <Container>
            <AddCharacterField playerId={id} />
            <EditableCharacterListTable
                charList={charListData}
            />
        </Container>
    );
}
