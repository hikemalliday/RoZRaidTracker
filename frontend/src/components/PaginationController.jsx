import { IconButton, Stack } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { buttonStyles } from '../styles';

export function PaginationController({ setPage, previous, next, styles = {} }) {
   

    return (
        <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            sx={{ ...styles, marginBottom: 3 }}
        >
            <IconButton
                disabled={!previous}
                sx={buttonStyles}
                onClick={() => (previous ? setPage(prev => prev - 1) : null)}
            >
                <ChevronLeftIcon />
            </IconButton>
            <IconButton
                disabled={!next}
                sx={buttonStyles}
                onClick={() => (next ? setPage(prev => prev + 1) : null)}
            >
                <ChevronRightIcon />
            </IconButton>
        </Stack>
    );
}
