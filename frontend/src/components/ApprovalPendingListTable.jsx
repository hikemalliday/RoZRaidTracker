import { TableRow } from '@mui/material';
import { getLinkCell, TableList } from './Tables.jsx';
import { joinAndTruncate } from '../views/utils.jsx';

export function ApprovalPendingListTable({ data }) {
    const getApprovalRows = sorted => {
        return sorted.map((row, i) => {
            const detailRoute = `/ra_approval_pending/${row?.id}`;
            return (
                <TableRow key={i}>
                    {getLinkCell(row?.id, detailRoute)}
                    {getLinkCell(row?.raid_name, detailRoute)}
                    {getLinkCell(joinAndTruncate(row?.players_list, 100), detailRoute)}
                    {getLinkCell(row?.created_at, detailRoute)}
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
