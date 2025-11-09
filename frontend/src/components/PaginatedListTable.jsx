import { useState } from 'react';
import { Container, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { selectComponentProps } from '../styles.js';
import { PaginationController } from './PaginationController.jsx';

export function PaginatedListTable({ requestHook, TableComponent, sortChoices = [] }) {
    const [page, setPage] = useState(1);
    const [orderDir, setOrderDir] = useState('asc');
    const [ordering, setOrdering] = useState('name');
    const { data, isPending, error } = requestHook({ page, ordering, orderDir });

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;

    const handleOrderDirChange = e => {
        return setOrderDir(e.target.value);
    };

    const handleOrderingChange = e => {
        return setOrdering(e.target.value);
    };

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
        </Container>
    );
}
