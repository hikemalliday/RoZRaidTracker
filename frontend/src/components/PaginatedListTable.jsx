import { useState } from 'react';
import { Container, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { selectComponentProps } from '../styles.js';
import { PaginationController } from './PaginationController.jsx';

export function PaginatedListTable({
    requestHook,
    TableComponent,
    sortChoices = [],
    sortMap = {},
}) {
    const _getOrdering = str => {
        return sortMap?.[str] || str;
    };

    const [page, setPage] = useState(1);
    const [orderDir, setOrderDir] = useState('asc');
    const [ordering, setOrdering] = useState(sortChoices[0] || 'name');
    const { data, isPending, error } = requestHook({
        page,
        ordering: _getOrdering(ordering),
        orderDir,
    });

    const handleOrderDirChange = e => {
        return setOrderDir(e.target.value);
    };

    const handleOrderingChange = e => {
        return setOrdering(_getOrdering(e.target.value));
    };

    if (error) return <>{error.message}</>;

    return (
        <Container>
            <Container sx={{ marginTop: 10, display: 'flex' }}>
                <Container>
                    <InputLabel sx={{ color: 'white' }}>Sort By</InputLabel>
                    <Select
                        {...selectComponentProps}
                        variant="standard"
                        onChange={handleOrderingChange}
                        label="ordering"
                        value={ordering}
                    >
                        {sortChoices.map((choice, i) => {
                            return (
                                <MenuItem key={i} value={choice}>
                                    {choice}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </Container>
                <Container>
                    <InputLabel sx={{ color: 'white' }}>Order</InputLabel>
                    <Select
                        {...selectComponentProps}
                        onChange={handleOrderDirChange}
                        variant="standard"
                        label="order dir"
                        value={orderDir}
                    >
                        {['asc', 'desc'].map((choice, i) => {
                            return (
                                <MenuItem key={i} value={choice}>
                                    {choice}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </Container>
            </Container>
            {isPending ? (
                <>LOADING...</>
            ) : (
                <>
                    <PaginationController
                        styles={{ marginTop: 5 }}
                        page={page}
                        setPage={setPage}
                        previous={data.previous}
                        next={data.next}
                    />
                    <Typography>{`total: ${data.count}`}</Typography>
                    <TableComponent
                        sortable={false}
                        data={data.results}
                        rowStyles={{
                            '& .MuiTableCell-root': {
                                padding: '4px',
                            },
                            height: '36px',
                        }}
                    />
                </>
            )}
        </Container>
    );
}
