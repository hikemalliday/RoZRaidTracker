// import { useState } from 'react';
// import { useDebounce } from '../hooks/useDebounce.js';
// import { useListDebounced } from '../hooks/requests.js';
// import { Autocomplete, TextField } from '@mui/material';
//
// const textFieldStyles = {
//     '& .MuiOutlinedInput-root': {
//         color: 'white',
//         '& fieldset': {
//             borderColor: 'rgba(255,255,255,0.4)',
//         },
//         '&:hover fieldset': {
//             borderColor: 'rgba(255,255,255,0.7)',
//         },
//         '&.Mui-focused fieldset': {
//             borderColor: '#66b2ff', // same as MUI docs
//             borderWidth: 2,
//         },
//     },
//     '& .MuiInputLabel-root': {
//         color: 'rgba(255,255,255,0.7)',
//     },
//     '& label.Mui-focused': {
//         color: '#66b2ff',
//     },
// };
//
// const listBoxStyles = {
//     backgroundColor: '#121212',
//     color: 'white',
//     border: '1px solid rgba(255,255,255,0.2)',
//     '& .MuiAutocomplete-option': {
//         padding: '8px 12px',
//         '&.Mui-focused': {
//             backgroundColor: 'rgba(255,255,255,0.12)',
//         },
//         '&.Mui-selected': {
//             backgroundColor: 'rgba(102,178,255,0.25)',
//         },
//         '&.Mui-selected:hover': {
//             backgroundColor: 'rgba(102,178,255,0.35)',
//         },
//     },
// };
//
// export function SearchableField({
//     queryKey,
//     route,
//     filterOn,
//     modelName,
//     fieldResults,
//     componentKey,
// }) {
//     /* 'fieldResults' prop is the 'form' data object, so to speak, passed down from the parent.
//      * The selected option will be stored in this object, and then ultimately posted to the backend.
//      * 'componentKey' prop is necessary so that we can save the selected field in the 'fieldResults object',
//      * and have a way to differentiate from the other rendered 'SearchableField' components.
//      * */
//     const [value, setValue] = useState('');
//     const debounced = useDebounce(value || '', 300);
//     const { data, isPending } = useListDebounced(queryKey, route, filterOn, debounced);
//     const reducedOptions = results => {
//         if (!results) return [];
//         return results.map(res => {
//             return { id: res.id, label: res[filterOn] };
//         });
//     };
//
//     return (
//         <Autocomplete
//             renderInput={params => <TextField {...params} label="Item" sx={textFieldStyles} />}
//             options={!isPending ? reducedOptions(data.results) : []}
//             filterOptions={x => x}
//             onInputChange={(event, newInputValue) => {
//                 setValue(newInputValue);
//             }}
//             inputValue={value}
//             slotProps={{ listbox: { sx: listBoxStyles } }}
//             onChange={(_, option) => {
//                 if (!fieldResults.current[componentKey]) fieldResults.current[componentKey] = {};
//                 fieldResults.current[componentKey][modelName] = option;
//                 console.log(fieldResults);
//             }}
//         />
//     );
// }
