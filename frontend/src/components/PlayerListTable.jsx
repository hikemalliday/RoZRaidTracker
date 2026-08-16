import { getCell, getLinkCell, TableList } from './Tables.jsx';
import { TableRow } from '@mui/material';
// TODO: There were mentions of allowing 2 main alts. So this single 'alt' might be insufficient
export function PlayerListTable({ data, rowStyles = {}, sortable = true }) {
    const getPlayerRows = sorted => {
        return sorted.map((row, i) => {
            const main = row.characters.find(char => char.type === "MAIN");
            const alt = row.characters.find(char => char.type === "MAIN_ALT");
            return (
                <TableRow key={i} sx={rowStyles}>
                    {getLinkCell(row?.name, `/player/${row?.id}`)}
                    {getCell(main?.name, `/character/${main?.id}`)}
                    {getCell(alt?.name, `/character/${alt?.id}`)}
                    {getCell(`${row?.lifetime_ra}%`)}
                    {getCell(`${row?.ra_21_day}%`)}
                    {getCell(`${row?.active}`)}
                </TableRow>
            );
        });
    };

    const headerMap = {
        Name: 'name',
        Main: null,
        Alt: null,
        'Lifetime RA': 'lifetime_ra',
        '21 Day': 'ra_21_day',
        Active: 'active',
    };

    return (
        <TableList
            data={data}
            getTableRows={getPlayerRows}
            headerMap={headerMap}
            sortable={sortable}
        />
    );
}
