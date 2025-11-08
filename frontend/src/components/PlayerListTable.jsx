import { getCell, getLinkCell, TableList } from './Tables.jsx';
import { TableRow } from '@mui/material';

export function PlayerListTable({ data, rowStyles = {} }) {
    const getPlayerRows = sorted => {
        return sorted.map((row, i) => {
            const main = row.characters.find(char => char.is_main === true);
            const alt = row.characters.find(char => char.is_main_alt === true);
            return (
                <TableRow key={i} sx={rowStyles}>
                    {getLinkCell(row?.name, `/player/${row?.id}`)}
                    {getCell(main?.name, `/character/${main?.id}`)}
                    {getCell(alt?.name, `/character/${alt?.id}`)}
                    {getCell(`${row?.lifetime_ra}%`)}
                </TableRow>
            );
        });
    };

    const headerMap = {
        Name: 'name',
        Main: null,
        Alt: null,
        'Lifetime RA': 'lifetime_ra',
    };

    return <TableList data={data} getTableRows={getPlayerRows} headerMap={headerMap} />;
}
