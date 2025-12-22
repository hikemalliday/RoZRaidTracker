import { getCell, getItemIconCell, getLinkCell, TableList } from './Tables.jsx';
import { TableRow } from '@mui/material';
import { get21DayStyles, getIs21Day, getRowStyles, VERY_DARK_GRAY } from '../styles.js';
import { getLootType } from '../views/utils.jsx';

export function ItemAwardedListTable({
    data,
    highlight21Day = false,
    styledRows = false,
    ...rest
}) {
    const getItemAwardedRows = data => {
        return data.map((row, i) => {
            const styles21Day = get21DayStyles(row);
            const rowStyles = styledRows ? { ...getRowStyles(row), ...styles21Day } : styles21Day;
            return (
                <TableRow key={i} sx={rowStyles}>
                    {getItemIconCell(row?.item?.icon_id)}
                    {getCell(row?.item?.name)}
                    {getLinkCell(row?.player?.name, `/player/${row?.player?.id}`)}
                    {getLinkCell(row?.raid?.name, `/raid/${row?.raid?.id}`)}
                    {getCell(row?.raid?.created_at)}
                    {getCell(getLootType(row))}
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
    };
    return (
        <TableList
            headerMap={headerMap}
            data={data}
            getTableRows={getItemAwardedRows}
            styledRows={styledRows}
            {...rest}
        />
    );
}
