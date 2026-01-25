import { getCell, getCheckboxCell, getItemIconCell, getLinkCell, TableList } from './Tables.jsx';
import { TableRow } from '@mui/material';
import { useRef } from 'react';
import { useItemAwardedDelete } from '../hooks/requests.js';
import { get21DayStyles, getRowStyles } from '../styles.js';
import { getLootType } from '../views/utils.jsx';

export function ItemAwardedListTableEditable({
    data,
    highlight21Day = false,
    styledRows = false,
    ...rest
}) {
    const { mutate } = useItemAwardedDelete();
    const itemsToRemove = useRef(new Set());

    const getItemAwardedRows = data => {
        return data.map((row, i) => {
            const handleCheckboxClick = e => {
                if (e.target.checked) {
                    itemsToRemove.current.add(row?.id);
                } else {
                    return itemsToRemove.current.delete(row?.id);
                }
            };
            const styles21Day = get21DayStyles(row);
            const stylesObj = styledRows ? { ...getRowStyles(row), ...styles21Day } : styles21Day;

            return (
                <TableRow key={row?.id} sx={stylesObj}>
                    {getItemIconCell(row?.item?.icon_id)}
                    {getCell(row?.item?.name)}
                    {getLinkCell(row?.player?.name, `/player/${row?.player?.id}`)}
                    {getLinkCell(row?.raid?.name, `/raid/${row?.raid?.id}`)}
                    {getCell(row?.raid?.created_at)}
                    {getCell(getLootType(row))}
                    {getCheckboxCell(handleCheckboxClick)}
                </TableRow>
            );
        });
    };

    const handleRemoveItemsAwardedSubmit = async () => {
        if (itemsToRemove.current.size === 0) return;
        const arrayOfItemsToRemove = [...itemsToRemove.current];
        const promises = arrayOfItemsToRemove.map(itemId => {
            return mutate(itemId);
        });
        await Promise.allSettled(promises);
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
        <>
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
                onClick={handleRemoveItemsAwardedSubmit}
            >
                Remove Selected Items
            </button>
        </>
    );
}
