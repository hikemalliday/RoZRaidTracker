import { TableRow } from '@mui/material';
import { CellNonClickable, TableList } from './Tables.jsx';
import { joinAndTruncate } from '../views/utils.jsx';

export function ApprovalHistoryListTable({ data }) {
    const getApprovalRows = sorted => {
        return sorted.map((row, i) => {
            return (
                <TableRow key={i}>
                    <CellNonClickable val={row?.id} />
                    <CellNonClickable val={row?.raid_name} />
                    <CellNonClickable val={joinAndTruncate(row?.players_list, 100)} />
                    <CellNonClickable val={row?.created_at} />
                </TableRow>
            );
        });
    };

    const headerMap = {
        ID: 'id',
        'Raid Name': 'raid_name',
        Players: 'players_list',
        Date: 'created_at',
    };

    return <TableList data={data} getTableRows={getApprovalRows} headerMap={headerMap} />;
}
