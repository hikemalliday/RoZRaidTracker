import React, { useState } from 'react';
import { CompareItemsView } from './CompareItemsView.jsx';
import { Box } from '@mui/material';
import { MageloCompareView } from './MageloCompareView.jsx';

export function CompareView() {
    const [mageloView, setMageloView] = useState(false);

    const _handleClick = tabName => {
        return setMageloView(tabName === 'magelo');
    };

    const tabStyles = isActive => ({
        paddingLeft: 3,
        paddingRight: 3,
        paddingTop: 1.25,
        paddingBottom: 1.25,
        fontSize: '0.8125rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        userSelect: 'none',
        color: isActive ? '#ffffff' : '#888888',
        borderBottom: isActive ? '2px solid #ffffff' : '2px solid transparent',
        transition: 'color 0.2s, border-color 0.2s',
        ':hover': {
            color: isActive ? '#ffffff' : '#cccccc',
        },
    });

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 2,
                }}
            >
                <Box onClick={() => _handleClick('items')} sx={tabStyles(!mageloView)}>
                    Items
                </Box>
                <Box onClick={() => _handleClick('magelo')} sx={tabStyles(mageloView)}>
                    Magelo
                </Box>
            </Box>
            {mageloView ? <MageloCompareView /> : <CompareItemsView />}
        </Box>
    );
}
