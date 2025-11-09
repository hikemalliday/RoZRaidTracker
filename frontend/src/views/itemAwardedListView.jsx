import { useItemAwardedList } from '../hooks/requests.js';
import { ItemAwardedListTable } from '../components/ItemAwardedListTable.jsx';
import { Container, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { selectComponentProps } from '../styles.js';
import { PaginationController } from '../components/PaginationController.jsx';
import { useState } from 'react';

export function ItemAwardedListView() {
    const [page, setPage] = useState(1);
    const [order, setOrder] = useState('asc');
    const [sortBy, setSortBy] = useState('name');

    const { data, isPending, error } = useItemAwardedList({ page, sortBy, order });

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;

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
                        {['name', 'player', 'raid', 'date'].map((choice, i) => {
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
            <Typography>{`total: ${data.count}`}</Typography>
            <ItemAwardedListTable
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
