import { useState } from 'react';
import {
    Autocomplete,
    Box,
    Container,
    Divider,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { textFieldStyles } from '../styles.js';
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
        return setOrdering(e.target.value);
    };

    if (error) return <>{error.message}</>;

    const selectStyles = {
        minWidth: 140,
        '& .MuiOutlinedInput-root': {
            color: 'white',
            '& fieldset': {
                borderColor: 'rgba(255,255,255,0.23)',
            },
            '&:hover fieldset': {
                borderColor: 'rgba(255,255,255,0.5)',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#66b2ff',
            },
        },
        '& .MuiSelect-icon': {
            color: 'rgba(255,255,255,0.7)',
        },
    };

    const labelStyles = {
        color: 'rgba(255,255,255,0.7)',
        '&.Mui-focused': {
            color: '#66b2ff',
        },
    };

    return (
        <Container>
            <Stack
                direction="row"
                spacing={3}
                justifyContent="center"
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
                sx={{ marginTop: 4, marginBottom: 2 }}
            >
                {searchParam && (
                    <Autocomplete
                        renderInput={params => (
                            <TextField
                                {...params}
                                label={optionsLabel}
                                placeholder={`Search ${optionsLabel}...`}
                                sx={{
                                    ...textFieldStyles,
                                    '& .MuiOutlinedInput-root': {
                                        ...textFieldStyles['& .MuiOutlinedInput-root'],
                                        width: 350,
                                    },
                                }}
                                size="small"
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <>
                                            <InputAdornment position="start">
                                                <SearchIcon
                                                    sx={{ color: 'rgba(255,255,255,0.5)' }}
                                                />
                                            </InputAdornment>
                                            {params.InputProps.startAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                        options={
                            !isOptionsPending
                                ? reduceOptions(optionsData.results)
                                : []
                        }
                        onChange={(_, option) => {
                            setSearchVal(option.label);
                        }}
                    />
                )}
                {searchParam && (
                    <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ borderColor: 'rgba(255,255,255,0.12)' }}
                    />
                )}
                <Stack direction="row" spacing={2} alignItems="center">
                    <FormControl size="small" sx={selectStyles}>
                        <InputLabel sx={labelStyles}>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <SortIcon fontSize="small" />
                                <span>Sort By</span>
                            </Stack>
                        </InputLabel>
                        <Select
                            label="Sort By..."
                            onChange={handleOrderingChange}
                            value={ordering}
                            MenuProps={{ disableScrollLock: true }}
                        >
                            {sortChoices.map((choice, i) => (
                                <MenuItem key={i} value={choice}>
                                    {choice}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={selectStyles}>
                        <InputLabel sx={labelStyles}>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <SwapVertIcon fontSize="small" />
                                <span>Order</span>
                            </Stack>
                        </InputLabel>
                        <Select
                            label="Order..."
                            onChange={handleOrderDirChange}
                            value={orderDir}
                            MenuProps={{ disableScrollLock: true }}
                        >
                            <MenuItem value="asc">Ascending</MenuItem>
                            <MenuItem value="desc">Descending</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </Stack>
            {isPending ? (
                <>LOADING...</>
            ) : (
                <>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ marginTop: 3 }}
                    >
                        <Typography
                            variant="body2"
                            sx={{ color: 'rgba(255,255,255,0.6)' }}
                        >
                            {data.count} results
                        </Typography>
                        <PaginationController
                            page={page}
                            setPage={setPage}
                            previous={data.previous}
                            next={data.next}
                            styles={{ marginBottom: 0 }}
                        />
                    </Stack>
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
