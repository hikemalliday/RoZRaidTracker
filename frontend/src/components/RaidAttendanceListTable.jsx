import { CellNonClickable, LinkCell, TableList } from './Tables.jsx';
import { TableRow } from '@mui/material';

export function RaidAttendanceListTable({ data, rowStyles = {}, ...rest }) {
    const getRaRows = data => {
        return data.map((row, i) => {
            return (
                <TableRow key={i} sx={rowStyles}>
                    <LinkCell val={row?.player?.name} route={`/player/${row?.player?.id}`}/>
                    <LinkCell val={row?.raid?.name} route={`/raid/${row?.raid?.id}`}/>
                    <CellNonClickable val={row?.created_at}/>
                </TableRow>
            );
        });
    };

    const headerMap = {
        Player: 'player.name',
        Raid: 'raid.name',
        Date: 'created_at',
    };
    return <TableList headerMap={headerMap} data={data} getTableRows={getRaRows} {...rest} />;
}
