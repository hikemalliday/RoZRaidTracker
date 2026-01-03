import { useState } from 'react';
import {
    Autocomplete,
    Box,
    Container,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { selectComponentProps, textFieldStyles } from '../styles.js';
import { PaginationController } from './PaginationController.jsx';

export function PaginatedListTable({
    requestHook,
    TableComponent,
    sortChoices = [],
    sortMap = {},
    defaultSort = {},
    searchParam = null,
    useOptions = () => {
        return { data: [], isPending: false };
    },
    optionsLabel = '',
    reduceOptions = () => [],
}) {
    const _getOrdering = str => {
        return sortMap?.[str] || str;
    };

    const [page, setPage] = useState(1);
    const [orderDir, setOrderDir] = useState(defaultSort?.orderDir || 'asc');
    const [ordering, setOrdering] = useState(defaultSort?.ordering || 'name');
    const [searchVal, setSearchVal] = useState('');
    const qParam = searchParam ? { [searchParam]: searchVal } : {};
    const { data, isPending, error } = requestHook({
        page,
        ordering: _getOrdering(ordering),
        orderDir,
        ...qParam,
    });
    const { data: optionsData, isPending: isOptionsPending } = useOptions();

    const handleOrderDirChange = e => {
        return setOrderDir(e.target.value);
    };

    const handleOrderingChange = e => {
        return setOrdering(_getOrdering(e.target.value));
    };

    if (error) return <>{error.message}</>;

    return (
        <Container>
            {searchParam && (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                    <Autocomplete
                        renderInput={params => (
                            <TextField
                                {...params}
                                label={optionsLabel}
                                sx={textFieldStyles}
                                size="small"
                            />
                        )}
                        options={!isOptionsPending ? reduceOptions(optionsData.results) : []}
                        onChange={(_, option) => {
                            setSearchVal(option.label);
                        }}
                    />
                </Box>
            )}
            <Container sx={{ marginTop: 5, display: 'flex' }}>
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
