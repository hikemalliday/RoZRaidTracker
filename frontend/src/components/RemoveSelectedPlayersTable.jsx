import { Box, TableCell, TableRow, Button } from '@mui/material';
import React from 'react';
import { get21DayStyles, tableBox } from '../styles.js';
import { CellNonClickable, TableList } from './Tables.jsx';
import { buttonStyles } from '../styles.js';

export function RemoveSelectedPlayersTable({
    playersToRender,
    setSelectedRows,
    onSubmit,
    ...rest
}) {
    const _handleCheckbox = (e, raId) => {
        if (e.target.checked) {
            setSelectedRows(prev => [...prev, raId]);
        } else {
            setSelectedRows(prev => prev.filter(id => id !== raId));
        }
    };

    const getPlayersToRemoveRows = data => {
        return data.map(row => {
            return (
                <TableRow key={row?.id} sx={get21DayStyles(row)}>
                    <CellNonClickable val={row?.name} />
                    <TableCell align="right">
                        <input type="checkbox" onChange={e => _handleCheckbox(e, row?.id)} />
                    </TableCell>
                </TableRow>
            );
        });
    };

    // Null vals means col is not sortable (frontend table sorting)
    const headerMap = {
        Name: 'player.name',
        Remove: null,
    };
    const headerAlign = {
        Remove: 'right',
    };
    if (!playersToRender) return <></>;
    return (
        <Box sx={tableBox}>
            <TableList
                headerMap={headerMap}
                headerAlign={headerAlign}
                data={playersToRender}
                getTableRows={getPlayersToRemoveRows}
                {...rest}
            />
            <Button
                sx={buttonStyles}
                onClick={onSubmit}
            >
                REMOVE SELECTED
            </Button>
        </Box>
    );
}
