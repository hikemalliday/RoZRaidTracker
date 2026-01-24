import { IconButton, Stack } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export function PaginationController({ setPage, previous, next, styles = {} }) {
    const buttonStyles = {
        color: 'white',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 2,
        width: 40,
        height: 40,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            backgroundColor: 'rgba(102, 178, 255, 0.15)',
            borderColor: '#66b2ff',
        },
        '&.Mui-disabled': {
            color: 'rgba(255, 255, 255, 0.3)',
            borderColor: 'rgba(255, 255, 255, 0.05)',
        },
    };

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
