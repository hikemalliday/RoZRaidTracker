import { LinkCell, LootTypeBadgeCell, TableList } from './Tables.jsx';
import { TableRow, TableCell, Box } from '@mui/material';
import { get21DayStyles } from '../styles.js';
import { ItemToolTip } from './ItemToolTip.jsx';

export function ItemAwardedListTable({
    data,
    styledRows = false,
    dataTestId = null,
    ...rest
}) {
    const getItemAwardedRows = data => {
        return data.map((row, i) => {
            return (
                <TableRow key={i} sx={get21DayStyles(row)}>
                    <ItemToolTip item={row?.item} />
                    <LinkCell val={row?.player?.name} route={`/player/${row?.player?.id}`}/>
                    <LinkCell val={row?.raid?.name} route={`/raid/${row?.raid?.id}`}/>
                    <TableCell
                        id="non-clickable-cell"
                        sx={{ color: '#9ca3af', whiteSpace: 'nowrap' }}
                    >
                        {row?.raid?.created_at}
                    </TableCell>
                    <LootTypeBadgeCell lootType={row.type}/>
                </TableRow>
            );
        });
    };

    // Null vals means col is not sortable (frontend table sorting)
    const headerMap = {
        Name: 'item.name',
        Player: 'player.name',
        Raid: 'raid.name',
        Date: 'raid.created_at',
        Type: null,
    };

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
