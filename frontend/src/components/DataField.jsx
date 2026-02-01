import { Box } from '@mui/material';
import React from 'react';
import { dataLabel } from '../styles.js';

export function DataField({ label, value, sx = {} }) {
    return (
        <Box sx={sx}>
            <Box sx={dataLabel}>{label}</Box>
            <Box sx={{ color: '#fff', fontWeight: 600 }}>{value}</Box>
        </Box>
    );
}
