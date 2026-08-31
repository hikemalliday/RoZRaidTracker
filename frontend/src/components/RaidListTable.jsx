import { CellNonClickable, LinkCell, TableList } from './Tables.jsx';
import React from 'react';
import { TableRow } from '@mui/material';

export function RaidListTable({ data, rowStyles = {} }) {
    const getRaidRows = data => {
        return data.map((row, i) => {
            return (
                <TableRow key={i} sx={rowStyles}>
                    <LinkCell val={row?.name} route={`/raid/${row?.id}`} />
                    <CellNonClickable val={row?.created_at} />
                </TableRow>
            );
        });
    };

    const headerMap = {
        Name: 'name',
        Date: 'created_at',
    };
    return <TableList headerMap={headerMap} data={data} getTableRows={getRaidRows} />;
}
