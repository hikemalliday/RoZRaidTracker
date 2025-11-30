// import { useParams } from 'react-router';
// import { useDetail, useList, useRaidAttendanceApprovalMutation } from '../hooks/requests.js';
// import {
//     Autocomplete,
//     Button,
//     CircularProgress,
//     Container,
//     Table,
//     TableBody,
//     TableCell,
//     TableRow,
//     TextField,
//     Typography,
// } from '@mui/material';
// import { useState, useMemo } from 'react';
// import { buttonStyles } from '../styles.js';
// import { useDebounce } from '../hooks/useDebounce.js';
//
// // Split the Autocomplete component to isolate state and re-renders
// const ItemAutocomplete = ({ setItem, isItemsPending, itemsError, items }) => {
//     const [inputValue, setInputValue] = useState('');
//
//     // Debounce the input string (not an object)
//     const debouncedInput = useDebounce(inputValue, 300);
//
//     // Call useList with debounced input
//     const { isPending, data, error } = useList('items', '/items/', debouncedInput ? { name: debouncedInput } : {});
//
//     // Memoize items to prevent unnecessary re-renders
//     const itemOptions = useMemo(() => data?.results || [], [data]);
//
//     return (
//         <Autocomplete
//             freeSolo
//             options={itemOptions}
//             getOptionLabel={(option) => option.name || ''}
//             loading={isPending}
//             onInputChange={(event, newInputValue) => {
//                 setInputValue(newInputValue);
//                 setItem(newInputValue); // Update parent state
//             }}
//             renderInput={(params) => (
//                 <TextField
//                     {...params}
//                     label="Search Items"
//                     variant="outlined"
//                     error={!!error}
//                     helperText={error ? 'Error fetching items' : ''}
//                     InputProps={{
//                         ...params.InputProps,
//                         endAdornment: (
//                             <>
//                                 {isPending ? <CircularProgress color="inherit" size={20} /> : null}
//                                 {params.InputProps.endAdornment}
//                             </>
//                         ),
//                     }}
//                 />
//             )}
//             sx={{ width: 300 }}
//         />
//     );
// };
//
// // Memoize the Table component to prevent re-renders
// const PlayersTable = ({ players }) => {
//     const getPlayersRows = (players) => {
//         const _getTableRow = (cells) => (
//             <TableRow
//                 sx={{
//                     '& .MuiTableCell-root': {
//                         padding: '4px',
//                         color: 'white',
//                     },
//                     height: '36px',
//                 }}
//             >
//                 {cells}
//             </TableRow>
//         );
//
//         const results = [];
//         let cellsArray = [];
//
//         players.forEach((player, i) => {
//             cellsArray.push(
//                 <TableCell key={i} sx={{ color: 'white' }}>
//                     {player}
//                 </TableCell>
//             );
//
//             if (cellsArray.length === 10 || i === players.length - 1) {
//                 results.push(_getTableRow(cellsArray));
//                 cellsArray = [];
//             }
//         });
//
//         return results;
//     };
//
//     return (
//         <Table
//             sx={{
//                 marginBottom: '20px',
//                 marginTop: '20px',
//                 display: 'flex',
//                 justifyContent: 'center',
//             }}
//         >
//             <TableBody>{getPlayersRows(players)}</TableBody>
//         </Table>
//     );
// };
//
// // Memoize PlayersTable to prevent unnecessary re-renders
// const MemoizedPlayersTable = React.memo(PlayersTable);
//
// export function ApprovalDetailView() {
//     const { id } = useParams();
//     const { isPending, data, error } = useDetail('raid_attendance_approval', '/raid_attendance_approval/', id);
//     const { mutate } = useRaidAttendanceApprovalMutation(id);
//     const [raid, setRaid] = useState('');
//     const [item, setItem] = useState('');
//
//     if (isPending) return <>LOADING...</>;
//     if (error) return <>{error.message}</>;
//
//     const submitApproval = () => {
//         const payload = {
//             raid_name: raid,
//             players: data?.players_list,
//         };
//         mutate({ payload });
//     };
//
//     return (
//         <Container
//             sx={{
//                 marginTop: 5,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 gap: 1,
//                 alignItems: 'center',
//             }}
//         >
//             <ItemAutocomplete setItem={setItem} />
//             <TextField
//                 label="Raid Name"
//                 color="secondary"
//                 sx={{
//                     width: '225px',
//                     marginLeft: 0.5,
//                     '& .MuiInputBase-input': {
//                         color: 'white',
//                     },
//                     '& .MuiInputBase-root': {
//                         backgroundColor: '#333333',
//                         borderRadius: '8px',
//                         height: '40px',
//                     },
//                     '& .MuiOutlinedInput-notchedOutline': {
//                         borderColor: 'white',
//                         borderWidth: '2px',
//                     },
//                     '&:hover .MuiOutlinedInput-notchedOutline': {
//                         borderColor: 'white',
//                     },
//                     '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
//                         borderColor: 'white !important',
//                     },
//                     '& .MuiInputLabel-root': {
//                         color: 'white',
//                     },
//                     '& .MuiInputLabel-root.Mui-focused': {
//                         color: 'white',
//                     },
//                 }}
//                 onChange={(e) => setRaid(e.target.value)}
//             />
//             <Button
//                 sx={{ ...buttonStyles, paddingLeft: 1.5, paddingRight: 1.5, width: '225px' }}
//                 onClick={submitApproval}
//             >
//                 APPROVE
//             </Button>
//             <Typography sx={{ mt: 1 }}>
//                 Created at: <span style={{ fontWeight: 'bold' }}>{data.created_at}</span>
//             </Typography>
//             <MemoizedPlayersTable players={data.players_list} />
//         </Container>
//     );
// }
