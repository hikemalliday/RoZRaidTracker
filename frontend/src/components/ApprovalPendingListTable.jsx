import { TableRow } from '@mui/material';
import { CheckboxCell, LinkCell, TableList } from './Tables.jsx';
import { joinAndTruncate } from '../views/utils.jsx';
import { useState } from 'react';
import { useRaidAttendanceApprovalDelete } from '../hooks/requests.js';
// Table that allows user to delete options
export function ApprovalPendingListTable({ data }) {
    const [raidsToDelete, setRaidsToDelete] = useState(new Set());
    const { mutate } = useRaidAttendanceApprovalDelete();

    const handleCheckboxClick = (e, id) => {
        const raidsSet = new Set(raidsToDelete);
        const isChecked = e.target.checked;
        if (isChecked) raidsSet.add(id);
        else raidsSet.delete(id);
        setRaidsToDelete(raidsSet);
    };

    const handleDeleteSelectedRaidsToApprove = async () => {
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
                    <LinkCell val={row?.id} route={detailRoute} />
                    <LinkCell val={row?.raid_name} route={detailRoute} />
                    <LinkCell val={joinAndTruncate(row?.players_list, 100)} route={detailRoute} />
                    <LinkCell val={row?.created_at} route={detailRoute} />
                    <CheckboxCell changeHandler={e => handleCheckboxClick(e, row?.id)} />
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
