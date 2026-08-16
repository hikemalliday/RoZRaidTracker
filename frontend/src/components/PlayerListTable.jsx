import { getCell, getLinkCell, TableList } from './Tables.jsx';
import { TableRow } from '@mui/material';

export function PlayerListTable({ data, rowStyles = {}, sortable = true }) {
    const getPlayerRows = sorted => {
        return sorted.map((row, i) => {
            const main = row.characters.find(char => char.type === "MAIN");
            const mainAlts = row.characters.filter(char => char.type === "MAIN_ALT");
            const mainAlt1 = mainAlts.length > 0 ? mainAlts[0] : undefined;
            const mainAlt2 = mainAlts.length > 1 ? mainAlts[1] : undefined;
            return (
                <TableRow key={i} sx={rowStyles}>
                    {getLinkCell(row?.name, `/player/${row?.id}`)}
                    {getCell(main?.name, `/character/${main?.id}`)}
                    {getCell(mainAlt1?.name, `/character/${mainAlt1?.id}`)}
                    {getCell(mainAlt2?.name, `/character/${mainAlt2?.id}`)}
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
        'Main Alt 1': null,
        'Main Alt 2': null,
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
