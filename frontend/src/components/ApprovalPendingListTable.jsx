import { TableRow } from '@mui/material';
import { getCheckboxCell, getLinkCell, TableList } from './Tables.jsx';
import { joinAndTruncate } from '../views/utils.jsx';
import { useEffect, useState } from 'react';
import { useRaidAttendanceApprovalDelete } from '../hooks/requests.js';
// Table that allows user to delete options
export function ApprovalPendingListTable({ data }) {
    const [raidsToDelete, setRaidsToDelete] = useState(new Set());
    const { mutate } = useRaidAttendanceApprovalDelete();

    useEffect(() => {
        const raidIds = new Set(
            data.map(raid => {
                return raid.id;
            })
        );
        setRaidsToDelete(raidIds);
    }, [data]);

    const handleCheckboxClick = (e, id) => {
        const raidsSet = new Set(raidsToDelete);
        const isChecked = e.target.checked;
        if (isChecked) raidsSet.add(id);
        else raidsSet.delete(id);
        setRaidsToDelete(raidsSet);
    };

    const handleDeleteSelectedRaidsToApprove = async _ => {
        if (raidsToDelete.size === 0) return;
        const raidIdsArray = [...raidsToDelete];
        const promises = raidIdsArray.map(p => {
            return mutate(p);
        });
        await Promise.allSettled(promises);
        setRaidsToDelete(new Set());
    };

    const getApprovalRows = sorted => {
        return sorted.map((row, i) => {
            const detailRoute = `/ra_approval_pending/${row?.id}`;
            return (
                <TableRow key={i}>
                    {getLinkCell(row?.id, detailRoute)}
                    {getLinkCell(row?.raid_name, detailRoute)}
                    {getLinkCell(joinAndTruncate(row?.players_list, 100), detailRoute)}
                    {getLinkCell(row?.created_at, detailRoute)}
                    {getCheckboxCell(e => handleCheckboxClick(e, row?.id))}
                </TableRow>
            );
        });
    };

    const headerMap = {
        ID: 'id',
        'Raid Name': 'raid_name',
        Players: 'players_list',
        Date: 'created_at',
        Remove: null,
    };

    return (
        <>
            <TableList data={data} getTableRows={getApprovalRows} headerMap={headerMap} />
            <button
                style={{
                    display: 'flex',
                    alignItems: 'left',
                    marginTop: 5,
                }}
                onClick={handleDeleteSelectedRaidsToApprove}
            >
                Remove Selected Raids
            </button>
        </>
    );
}
