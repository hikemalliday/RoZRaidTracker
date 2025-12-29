import { useParams } from 'react-router';
import { useAuthContext } from '../context/AuthContext.jsx';
import { Autocomplete, Box, Container, TableRow, TextField, Typography } from '@mui/material';
import { useCharacterCreate, useCharacterEdit, useList } from '../hooks/requests.js';
import { renderErrors } from './utils.jsx';
import { useEffect, useState } from 'react';
import { getTextFieldStyles, textFieldStyles } from '../styles.js';
import {
    getCell,
    getCheckboxCellControlled,
    getLinkCell,
    TableList,
} from '../components/Tables.jsx';

function AddCharacterField({ playerId }) {
    const [charName, setCharName] = useState('');
    const [charClass, setCharClass] = useState('');
    const [isMainChecked, setIsMainChecked] = useState(false);
    const [isMainAltChecked, setIsMainAltChecked] = useState(false);
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

    const handleCheckboxClick = (e, charStatus) => {
        if (charStatus === 'main') {
            setIsMainChecked(!isMainChecked);
            setIsMainAltChecked(false);
        } else {
            setIsMainAltChecked(!isMainAltChecked);
            setIsMainChecked(false);
        }
    };

    const handleSubmit = () => {
        const payload = {
            name: charName,
            char_class: charClass,
            player_id: playerId,
            is_main: isMainChecked,
            is_main_alt: isMainAltChecked,
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
                    setCharClass(option.id);
                }}
            />
            <Box>
                <Typography>Main</Typography>
                <input
                    type="checkbox"
                    checked={isMainChecked}
                    onChange={e => handleCheckboxClick(e, 'main')}
                />
            </Box>
            <Box>
                <Typography>Main Alt</Typography>
                <input
                    type="checkbox"
                    checked={isMainAltChecked}
                    onChange={e => handleCheckboxClick(e, 'main alt')}
                />
            </Box>
            <button style={{ whiteSpace: 'nowrap' }} onClick={handleSubmit}>
                ADD CHARACTER
            </button>
        </Box>
    );
}

function EditableCharacterListTable({ data }) {
    const _getCharStatus = char => {
        if (char.is_main) return 'Main';
        if (char.is_main_alt) return 'Main Alt';
        return 'Alt';
    };
    // TODO: Do we make a useRef or useState right here based on 'data' ?
    const [formObject, setFormObject] = useState({});
    const { mutate } = useCharacterEdit();

    useEffect(() => {
        if (data) {
            const charsObject = {};
            for (const char of data) {
                charsObject[char.id] = {
                    id: char.id,
                    name: char.name,
                    is_main: char.is_main,
                    is_main_alt: char.is_main_alt,
                };
            }
            setFormObject(charsObject);
        }
    }, [data]);

    const getCharacterRows = sorted => {
        return sorted.map((row, i) => {
            // Pass down the main and main alt state from the form object, for the controlled checkbox inputs
            const mainState = formObject[row.id]?.is_main;
            const mainAltState = formObject[row.id]?.is_main_alt;

            const handleMainCheckboxClick = (e, charStatus) => {
                const _handleSetOtherFields = (id, bool, newFormObj) => {
                    // Helper to ensure that only one main or main alt can be selected at a time in the edit form
                    Object.entries(newFormObj).forEach(([charId, charData]) => {
                        const isSameChar = Number(charId) === Number(id);
                        if (bool === true && !isSameChar) {
                            charData[charStatus] = false;
                        } else {
                            const otherFieldToAlter =
                                charStatus === 'is_main' ? 'is_main_alt' : 'is_main';
                            charData[otherFieldToAlter] = false;
                        }
                    });
                };

                const checkboxBool = e.target.checked;
                const newFormObject = { ...formObject };
                newFormObject[row?.id][charStatus] = checkboxBool;
                _handleSetOtherFields(row?.id, checkboxBool, newFormObject);
                setFormObject(newFormObject);
            };

            return (
                <TableRow key={i}>
                    {getCell(row?.name)}
                    {getCell(row?.char_class)}
                    {getCell(_getCharStatus(row))}
                    {getLinkCell(row?.player.name, `/player/${row?.player?.id}`)}
                    {getCheckboxCellControlled(
                        e => handleMainCheckboxClick(e, 'is_main'),
                        mainState
                    )}
                    {getCheckboxCellControlled(
                        e => handleMainCheckboxClick(e, 'is_main_alt'),
                        mainAltState
                    )}
                </TableRow>
            );
        });
    };

    const handleEditCharactersSubmit = async _ => {
        if (formObject.length === 0) return;
        const promises = Object.values(formObject).map(char => {
            return mutate({ payload: char });
        });
        await Promise.allSettled(promises);
        setFormObject({});
    };

    // Null vals here means cols are not sortable
    const headerMap = {
        Name: null,
        Class: null,
        Status: null,
        Player: null,
        Main: null,
        'Main Alt': null,
    };
    return (
        <>
            <TableList data={data} getTableRows={getCharacterRows} headerMap={headerMap} />
            <button
                style={{
                    display: 'flex',
                    marginTop: 10,
                }}
                onClick={handleEditCharactersSubmit}
            >
                SAVE
            </button>
        </>
    );
}

export function PlayerEditView() {
    const { id } = useParams();
    const { isSuperUser } = useAuthContext();
    const { data, isPending, error } = useList('characters', '/characters/', {
        player: id,
    });

    if (!isSuperUser) return <>Unauthorized.</>;
    if (isPending) return <>LOADING...</>;
    if (error) renderErrors(error);

    return (
        <Container>
            <AddCharacterField playerId={id} />
            <EditableCharacterListTable data={data.results} />
        </Container>
    );
}
