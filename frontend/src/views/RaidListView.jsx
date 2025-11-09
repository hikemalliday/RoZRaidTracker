import { useRaidList } from '../hooks/requests.js';
import React, { useState } from 'react';
import { RaidListTable } from '../components/RaidListTable.jsx';
import { Container, InputLabel, MenuItem, Select } from '@mui/material';
import { PaginationController } from '../components/PaginationController.jsx';

export function RaidListView() {
    const [page, setPage] = useState(1);
    const [order, setOrder] = useState('asc');
    const [sortBy, setSortBy] = useState('name');
    const { data, isPending, error } = useRaidList({ page, sortBy, order });

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;

    const selectComponentProps = {
        variant: 'standard',
        sx: {
            marginTop: 1,
            backgroundColor: 'gray',
            width: 125,
            height: 32,
            padding: 1,
            '&:before': {
                borderBottomColor: 'white',
            },
            '&:after': {
                borderBottomColor: 'white',
            },
            borderTopLeftRadius: 1,
            borderTopRightRadius: 1,
        },
        MenuProps: {
            disableScrollLock: true,
        },
    };

    const handleOrderChange = e => {
        return setOrder(e.target.value);
    };

    const handleSortByChange = e => {
        return setSortBy(e.target.value);
    };

    return (
        <Container>
            <Container sx={{ marginTop: 10, display: 'flex' }}>
                <Container>
                    <InputLabel sx={{ color: 'white' }}>Sort By</InputLabel>
                    <Select
                        {...selectComponentProps}
                        variant="standard"
                        onChange={handleSortByChange}
                        label="sort by"
                        value={sortBy}
                    >
                        {['name', 'zone', 'date'].map((choice, i) => {
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
                        onChange={handleOrderChange}
                        variant="standard"
                        label="order"
                        value={order}
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
            <RaidListTable
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
