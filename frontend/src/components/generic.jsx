import { Box, Typography } from '@mui/material';

export function MetaDetail({ label, val }) {
    return (
        <Box>
            <Typography sx={{ fontSize: '0.7rem', color: 'gray', textTransform: 'uppercase' }}>
                {label}
            </Typography>
            <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{val}</Typography>
        </Box>
    );
}
