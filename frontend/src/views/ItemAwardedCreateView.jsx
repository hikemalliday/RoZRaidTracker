// // TODO: 1/3/26: File is defunct. Don't delete yet (just in case)
//
// import { useItemAwardedCreate, useList, useListDebounced } from '../hooks/requests.js';
// import { Autocomplete, Button, Container, TextField, Typography } from '@mui/material';
// import { useRef, useState } from 'react';
// import { useDebounce } from '../hooks/useDebounce.js';
// import { _getReducedResults, getRaidsListFinal } from './utils.jsx';
// import { buttonStyles, listBoxStyles, textFieldStyles } from '../styles.js';
// import { v4 as uuidv4 } from 'uuid';
// import { useNavigate } from 'react-router';
//
// function AddRaidField({ setRaidToSubmit, styles = {} }) {
//     const { data: raidsData, isPending: isRaidsPending } = useList('raidsDropdown', '/raids/', {
//         limit: 50,
//     });
//
//     return (
//         <Container
//             sx={{
//                 ...styles,
//                 display: 'flex',
//             }}
//         >
//             <Autocomplete
//                 renderInput={params => (
//                     <TextField {...params} label="Raid" sx={textFieldStyles} size="small" />
//                 )}
//                 options={!isRaidsPending ? getRaidsListFinal(raidsData.results) : []}
//                 onChange={(_, option) => {
//                     console.log(option);
//                     setRaidToSubmit(option.id);
//                 }}
//             />
//         </Container>
//     );
// }
//
// function ItemAwardedField({ fieldsResults, fieldKey }) {
//     /* 'fieldsResults' prop is the 'form' data object, so to speak, passed down from the parent.
//      * The selected option will be stored in this object, and then ultimately posted to the backend.
//      * 'fieldKey' prop is string UUID and is necessary so that we can save the selected field in the 'fieldResults object',
//      * and have a way to differentiate from the other rendered 'ItemAwardedField' components.
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
//         if (!fieldsResults.current[fieldKey]) fieldsResults.current[fieldKey] = {};
//         return (fieldsResults.current[fieldKey].alt_loot = !!e.target.checked);
//     };
//
//     const _handlePreferredCheckBox = e => {
//         if (!fieldsResults.current[fieldKey]) fieldsResults.current[fieldKey] = {};
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
//                 <Typography>Alt</Typography>
//                 <input type="checkbox" onChange={e => _handleAltLootCheckBox(e)} />
//             </Container>
//             <Container>
//                 <Typography>Preferred</Typography>
//                 <input type="checkbox" onChange={e => _handlePreferredCheckBox(e)} />
//             </Container>
//         </Container>
//     );
// }
//
// export function ItemAwardedCreateView() {
//     const navigate = useNavigate();
//     const fieldsResults = useRef({});
//     const [itemAwardedFields, setItemAwardedFields] = useState({});
//     const [raid, setRaid] = useState('');
//     const { mutate } = useItemAwardedCreate();
//
//     const removeField = (e, fieldKey) => {
//         delete fieldsResults.current[fieldKey];
//         setItemAwardedFields(prev => {
//             const newState = { ...prev };
//             delete newState[fieldKey];
//             return newState;
//         });
//     };
//
//     const addItemAwardedField = () => {
//         const fieldKey = uuidv4();
//         const field = (
//             <Container sx={{ display: 'flex' }} key={fieldKey}>
//                 <button onClick={_ => removeField(_, fieldKey)}>-</button>
//                 <ItemAwardedField fieldsResults={fieldsResults} fieldKey={fieldKey} />
//             </Container>
//         );
//         setItemAwardedFields(prev => {
//             return { ...prev, [fieldKey]: field };
//         });
//     };
//
//     const handleSubmit = async _ => {
//         const itemsToSubmit = Object.values(fieldsResults.current).map(val => {
//             const item_id = val.item.id;
//             const player_id = val.player.id;
//             const alt_loot = !!val.alt_loot;
//             const preferred = !!val.preferred;
//             return { item_id, player_id, alt_loot, preferred, raid_id: raid };
//         });
//         try {
//             await Promise.all(itemsToSubmit.map(payload => mutate({ payload })));
//             console.log('All items submitted successfully.');
//             navigate('/');
//         } catch (err) {
//             console.error('At least one item submission failed: ', err);
//         }
//     };
//
//     return (
//         <Container>
//             <AddRaidField setRaidToSubmit={setRaid} />
//             {Object.keys(itemAwardedFields).length
//                 ? Object.values(itemAwardedFields).map(field => field)
//                 : null}
//             <button onClick={addItemAwardedField}>ADD ITEM</button>
//             <Button
//                 sx={{ ...buttonStyles, paddingLeft: 1.5, paddingRight: 1.5, width: '225px' }}
//                 onClick={handleSubmit}
//             >
//                 SUBMIT
//             </Button>
//         </Container>
//     );
// }
