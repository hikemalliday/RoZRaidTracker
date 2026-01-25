import { Box, Typography, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { labelStyles } from '../styles.js';
import React from 'react';

export const renderErrors = errorsList => {
    return (
        <div id="errors-list">
            {errorsList.map(err => {
                return <div>{err.message}</div>;
            })}
        </div>
    );
};

export const handleAscDesc = (orderBy, sortBy) => {
    return orderBy === 'desc' ? `-${sortBy}` : sortBy;
};

export const _getReducedResults = results => {
    if (!results) return [];
    return results.map(res => {
        return { id: res.id, label: res.name };
    });
};

export const _getReduceItemAwardedResults = results => {
    if (!results) return [];
    return results.map(item => {
        return { id: item.id, label: item.name };
    });
};

const _sortReducedList = results => {
    return results.sort((a, b) => {
        const valA = a.label;
        const valB = b.label;
        return valA.localeCompare(valB);
    });
};

export const getPlayersListFinal = results => {
    const reducedList = _getReducedResults(results);
    return _sortReducedList(reducedList);
};

export const getItemOptionsListFinal = results => {
    return _getReduceItemAwardedResults(results);
};

export function joinAndTruncate(array, truncateLength = 50) {
    return array.join(', ').slice(0, truncateLength) + '...';
}

export function getLootType(itemObj) {
    let lootType = '';
    // Preferred
    if (itemObj.preferred && !itemObj.alt_loot && !itemObj.magelo) lootType = 'Preferred';
    // Preferred + Magelo
    else if (itemObj.preferred && !itemObj.alt_loot && itemObj.magelo)
        lootType = 'Preferred, Magelo';
    // Magelo and main
    else if (itemObj.magelo && !itemObj.alt_loot) lootType = 'Main, Magelo';
    // Main
    else if (!itemObj.alt_loot && !itemObj.magelo) lootType = 'Main';
    // Alt + Magelo
    else if (itemObj.alt_loot && itemObj.magelo) lootType = 'Alt, Magelo';
    // Alt
    else if (itemObj.alt_loot && !itemObj.magelo) lootType = 'Alt';
    return lootType;
}

export async function getItemInfo(itemId) {
    try {
        const res = await fetch(`https://www.pqdi.cc/get-item-tooltip/${itemId}`);
        const html = await res.text();
        return html;
    } catch (err) {
        console.error(err);
    }
}

export function fixLinks(htmlString, baseUrl = 'https://www.pqdi.cc/') {
    // Parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Find all <a> tags
    const links = doc.querySelectorAll('a');
    links.forEach(link => {
        const href = link.getAttribute('href');

        // Prepend baseUrl if link is relative (doesn't start with http or #)
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
            // Remove any leading slashes in href to avoid double slashes
            const cleanHref = href.replace(/^\/+/, '');
            link.setAttribute('href', `${baseUrl}${cleanHref}`);
        }

        // Make link open in new tab safely
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });

    return doc.body.innerHTML;
}

export const getItemAwardedMetaData = (itemsResults, isAuthenticated = false, isSuperUser = false, onEditClick = null) => {
    if (!itemsResults) return null;

    const _getItemsResultsMeta = res => {
        if (!res) return {};
        const resultsObj = {};
        res.forEach(item => {
            const isMainItem =
                item.alt_loot === false && item.preferred === false && item.magelo === false;
            const isAltItem = item.alt_loot === true && item.magelo === false;
            const isMageloMainItem = item.magelo === true && item.alt_loot === false;
            const isMageloAltItem = item.magelo === true && item.alt_loot === true;
            const isPreferredItem = item.preferred === true;

            if (isMainItem) resultsObj.main = resultsObj.main ? (resultsObj.main += 1) : 1;
            if (isAltItem) resultsObj.alt = resultsObj.alt ? (resultsObj.alt += 1) : 1;
            if (isMageloMainItem)
                resultsObj.mageloMain = resultsObj.mageloMain ? (resultsObj.mageloMain += 1) : 1;
            if (isMageloAltItem)
                resultsObj.mageloAlt = resultsObj.mageloAlt ? (resultsObj.mageloAlt += 1) : 1;
            if (isPreferredItem)
                resultsObj.preferred = resultsObj.preferred ? (resultsObj.preferred += 1) : 1;
        });
        return resultsObj;
    };

    const itemsResultsMeta = _getItemsResultsMeta(itemsResults);
    return (
        <Box
            sx={{
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '30px',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: '32px',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        sx={{
                            color: '#9ca3af',
                            fontSize: '13px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                        }}
                    >
                        Total Items Shown: {itemsResults.length}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography
                            sx={{
                                color: '#6b7280',
                                fontSize: '12px',
                                marginBottom: '4px',
                            }}
                        >
                            Magelo Main
                        </Typography>
                        <Typography
                            sx={{
                                color: '#fff',
                                fontSize: '18px',
                                fontWeight: 600,
                            }}
                        >
                            {itemsResultsMeta.mageloMain || 0}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography
                            sx={{
                                color: '#6b7280',
                                fontSize: '12px',
                                marginBottom: '4px',
                            }}
                        >
                            Magelo Alt
                        </Typography>
                        <Typography
                            sx={{
                                color: '#fff',
                                fontSize: '18px',
                                fontWeight: 600,
                            }}
                        >
                            {itemsResultsMeta.mageloAlt || 0}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography
                            sx={{
                                color: '#6b7280',
                                fontSize: '12px',
                                marginBottom: '4px',
                            }}
                        >
                            Preferred
                        </Typography>
                        <Typography
                            sx={{
                                color: '#fff',
                                fontSize: '18px',
                                fontWeight: 600,
                            }}
                        >
                            {itemsResultsMeta.preferred || 0}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography
                            sx={{
                                color: '#6b7280',
                                fontSize: '12px',
                                marginBottom: '4px',
                            }}
                        >
                            Main
                        </Typography>
                        <Typography
                            sx={{
                                color: '#fff',
                                fontSize: '18px',
                                fontWeight: 600,
                            }}
                        >
                            {itemsResultsMeta.main || 0}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography
                            sx={{
                                color: '#6b7280',
                                fontSize: '12px',
                                marginBottom: '4px',
                            }}
                        >
                            Alt
                        </Typography>
                        <Typography
                            sx={{
                                color: '#fff',
                                fontSize: '18px',
                                fontWeight: 600,
                            }}
                        >
                            {itemsResultsMeta.alt || 0}
                        </Typography>
                    </Box>
                </Box>
                {isAuthenticated && isSuperUser && onEditClick && (
                    <IconButton
                        onClick={onEditClick}
                        sx={{
                            color: '#9ca3af',
                            '&:hover': {
                                color: '#fff',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            },
                        }}
                    >
                        <SettingsIcon />
                    </IconButton>
                )}
            </Box>
        </Box>
    );
};
