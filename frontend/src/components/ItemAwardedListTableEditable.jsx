import {
    getCell,
    getCheckboxCell,
    getItemIconCell,
    getLinkCell,
    ItemAwardedNameEditableField,
    ItemAwardedPlayerEditableField,
    ItemAwardedTypeEditableField,
    TableList,
} from './Tables.jsx';
import { Box, TableRow } from '@mui/material';
import { useRef } from 'react';
import { useItemAwardedDelete, useItemAwardedEdit, usePlayersList } from '../hooks/requests.js';
import { get21DayStyles, tableBox } from '../styles.js';
import { getPlayersOptions } from '../views/utils.jsx';
// The most complex files in the app are def. these custom forms
// God speed when you come back in a couple of years and try to read this code :salute:
export function ItemAwardedListTableEditable({
    data,
    styledRows = false,
    formObject = {},
    ...rest
}) {
    const { data: playersData, isPending: isPlayersPending } = usePlayersList();
    const formObjectRef = useRef(formObject);
    const { mutate: deleteItemAwarded } = useItemAwardedDelete();
    const { mutate: editItemAwarded } = useItemAwardedEdit();

    if (isPlayersPending) return <>Loading...</>;

    const lootTypeMap = {
        'Preferred': "preferred",
        'Preferred, Magelo': "preferred_magelo",
        'Main, Magelo': "main_magelo",
        'Main': "main",
        'Alt, Magelo': "alt_magelo",
        'Alt': "alt",
        "Main Alt": "main_alt",
    };

    // TODO: Does the function passed to <button>.onClick expect a dummy arg? Would `()` not work here?
    const handleSubmitEditItems = _ => {
        // TODO: Currently, we are simply calling the mutation promises in line, and not really using these arrays.
        // TODO: Unsure if we want to actually resolve the promises or not.
        const deleteIds = [];
        const patchPayloads = [];

        Object.entries(formObjectRef.current).forEach(([itemAwardedId, form]) => {
            const deleteBool = form.delete;
            if (deleteBool === true) {
                deleteIds.push(deleteItemAwarded(itemAwardedId));
                delete formObjectRef.current[itemAwardedId];
                return;
            }

            // Only send patch request if the row was actually edited (dirty flag is set)
            if (!form.dirty) return;

            const payload = {
                id: itemAwardedId,
            };
            // Loop over 'form' param here
            Object.entries(form).forEach(([field, val]) => {
                if (field === 'delete' || field === 'dirty') return;
                if (field === 'lootType') {
                    payload.type = lootTypeMap[val];
                } else if (field === 'player' || field === 'item' || field === 'raid') {
                    // Backend expects player_id, item_id, raid_id
                    payload[`${field}_id`] = val;
                } else {
                    payload[field] = val;
                }
            });
            patchPayloads.push(editItemAwarded({ payload }));
        });
    };

    const getItemAwardedRows = data => {
        return data.map(row => {
            const handleCheckboxClick = e => {
                formObjectRef.current[row?.id].delete = !!e.target.checked;
            };
            formObjectRef.current[row?.id] = { delete: false };

            return (
                <TableRow key={row?.id} sx={get21DayStyles(row)}>
                    {getItemIconCell(row?.item?.icon_id)}
                    <ItemAwardedNameEditableField
                        formObject={formObjectRef}
                        itemAwardedDetail={row}
                    />
                    <ItemAwardedPlayerEditableField
                        formObject={formObjectRef}
                        itemAwardedDetail={row}
                        playersOptions={getPlayersOptions(playersData?.results) || []}
                    />
                    {getLinkCell(row?.raid?.name, `/raid/${row?.raid?.id}`)}
                    {getCell(row?.raid?.created_at)}
                    <ItemAwardedTypeEditableField
                        formObject={formObjectRef}
                        itemAwardedDetail={row}
                    />
                    {getCheckboxCell(handleCheckboxClick)}
                </TableRow>
            );
        });
    };

    // Null vals means col is not sortable (frontend table sorting)
    const headerMap = {
        '': null,
        Name: 'item.name',
        Player: 'player.name',
        Raid: 'raid.name',
        Date: 'raid.created_at',
        Type: null,
        Remove: null,
    };
    if (!data) return <></>;
    return (
        <Box sx={tableBox}>
            <TableList
                headerMap={headerMap}
                data={data}
                getTableRows={getItemAwardedRows}
                styledRows={styledRows}
                {...rest}
            />
            <button
                style={{
                    display: 'flex',
                    alignItems: 'left',
                    marginTop: 5,
                }}
                onClick={handleSubmitEditItems}
            >
                Submit
            </button>
        </Box>
    );
}
