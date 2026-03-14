import React, { useState } from 'react';
import { CompareItemsView } from './CompareItemsView.jsx';
import { Box } from '@mui/material';
import { MageloCompareView } from './MageloCompareView.jsx';

export function CompareView() {
    const [mageloView, setMageloView] = useState(false);

    const linkStyles = {
        ':hover': {
            color: '#93c5fd',
            cursor: 'pointer',
            fontWeight: 500,
            transition: 'color 0.2s',
        },
        ':active': {
            color: '#fff',
        },
    };

    const _handleClick = tabName => {
        return setMageloView(tabName === 'magelo');
    };

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 3,
                    fontWeight: 500,
                    userSelect: 'none',
                }}
            >
                <Box onClick={_ => _handleClick('items')} sx={linkStyles}>
                    ITEMS
                </Box>
                <Box onClick={_ => _handleClick('magelo')} sx={linkStyles}>
                    MAGELO
                </Box>
            </Box>
            {mageloView ? <MageloCompareView /> : <CompareItemsView />}
        </Box>
    );
}
