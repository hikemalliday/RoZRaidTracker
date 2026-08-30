import { getLinkCell, getLootTypeBadgeCell, getTierBadgeCell, TableList } from './Tables.jsx';
import { TableRow, TableCell, Box } from '@mui/material';
import { get21DayStyles } from '../styles.js';
import { ItemToolTip } from './ItemToolTip.jsx';

// excludePlayer param is used in CompareView when we want to gain more screen 'real-estate' in terms of columns.
export function ItemAwardedListTable({
    data,
    styledRows = false,
    dataTestId = null,
    excludePlayer = false,
    ...rest
}) {
    const getItemAwardedRows = data => {
        return data.map((row, i) => {
            return (
                <TableRow key={i} sx={get21DayStyles(row)}>
                    <ItemToolTip item={row?.item} />
                    {!excludePlayer && getLinkCell(row?.player?.name, `/player/${row?.player?.id}`)}
                    {getLinkCell(row?.raid?.name, `/raid/${row?.raid?.id}`)}
                    <TableCell
                        id="non-clickable-cell"
                        sx={{ color: '#9ca3af', whiteSpace: 'nowrap' }}
                    >
                        {row?.raid?.created_at}
                    </TableCell>
                    {getLootTypeBadgeCell(row.type)}
                    {getTierBadgeCell(row.item.tier)}
                </TableRow>
            );
        });
    };

    // Null vals means col is not sortable (frontend table sorting)
    // Gotta juggle stuff around here to get the optional 'player' col is the correct spot
    let headerMap = excludePlayer ? { Name: 'item.name' } : {
        Name: 'item.name',
        Player: 'player.name'
    };
    headerMap = {
        ...headerMap,
        Raid: 'raid.name',
        Date: 'raid.created_at',
        Type: null,
        Tier: null,
    }

    const playerCol = excludePlayer ? {} : { Player: 'player.name' };

    headerMap = { ...headerMap, ...playerCol };

    if (data.length === 0) return <>No items found.</>;

    return (
        <TableList
            headerMap={headerMap}
            data={data}
            getTableRows={getItemAwardedRows}
            styledRows={styledRows}
            dataTestId={dataTestId}
            {...rest}
        />
    );
}
