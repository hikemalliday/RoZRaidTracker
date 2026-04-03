import { Box, Typography } from '@mui/material';
import { labelStyles, metaDataLabel, metaDataText } from '../styles.js';
import React from 'react';
import { MetaDetail } from '../components/generic.jsx';

export const renderErrors = errorsList => {
    return (
        <div id="errors-list">
            {errorsList.map((err, index) => {
                return <div key={index}>{err?.message || 'Unknown error'}</div>;
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
    if (!results) return [];
    return results.sort((a, b) => {
        const valA = a.label;
        const valB = b.label;
        return valA.localeCompare(valB);
    });
};

const _getReducedPlayersOptions = players => {
    const options = [];
    for (const player of players) {
        if (player.characters.length === 0) {
            options.push({
                id: player.id,
                label: player.name,
            });
            continue;
        }
        for (const character of player.characters) {
            options.push({
                id: player.id,
                label: `${player.name} | ${character.name}`,
            });
        }
    }
    return options;
};

export const getPlayersListFinal = results => {
    if (!results) return [];
    const reducedList = _getReducedResults(results);
    return _sortReducedList(reducedList);
};

export const getPlayersOptions = results => {
    if (!results) return [];
    const reducedList = _getReducedPlayersOptions(results);
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

const _getItemsResultsMeta = res => {
    if (!res) return {};
    const resultsObj = {};
    res.forEach(item => {
        const isMainItem =
            item.alt_loot === false && item.magelo === false && item.preferred === false;
        const isAltItem =
            item.alt_loot === true && item.magelo === false && item.preferred === false;
        const isMageloMainItem =
            item.alt_loot === false && item.magelo === true && item.preferred === false;
        const isMageloAltItem =
            item.alt_loot === true && item.magelo === true && item.preferred === false;
        const isPreferredMagelo =
            item.alt_loot === false && item.magelo === true && item.preferred === true;
        const isPreferredItem =
            item.alt_loot === false && item.magelo === false && item.preferred === true;

        if (isMainItem) resultsObj.main = resultsObj.main ? (resultsObj.main += 1) : 1;
        if (isAltItem) resultsObj.alt = resultsObj.alt ? (resultsObj.alt += 1) : 1;
        if (isMageloMainItem)
            resultsObj.mageloMain = resultsObj.mageloMain ? (resultsObj.mageloMain += 1) : 1;
        if (isMageloAltItem)
            resultsObj.mageloAlt = resultsObj.mageloAlt ? (resultsObj.mageloAlt += 1) : 1;
        if (isPreferredItem)
            resultsObj.preferred = resultsObj.preferred ? (resultsObj.preferred += 1) : 1;
        if (isPreferredMagelo)
            resultsObj.preferredMagelo = resultsObj.preferredMagelo
                ? (resultsObj.preferredMagelo += 1)
                : 1;
    });
    return resultsObj;
};
// TODO: Does this belong in utils file?
export const getItemAwardedMetaDataEditable = (
    itemsResults,
    isAuthenticated = false,
    isSuperUser = false,
    onEditClick = null
) => {
    if (!itemsResults) return null;

    const itemsResultsMeta = _getItemsResultsMeta(itemsResults);
    return (
        <Box
            sx={{
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '30px',
                width: 'calc(100% + 80px)',
                marginLeft: '-20px',
                marginRight: '-20px',
                boxSizing: 'border-box',
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
                        <Typography sx={metaDataLabel}>Magelo Main</Typography>
                        <Typography sx={metaDataText}>
                            {itemsResultsMeta.mageloMain || 0}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={metaDataLabel}>Magelo Alt</Typography>
                        <Typography sx={metaDataText}>{itemsResultsMeta.mageloAlt || 0}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={metaDataLabel}>Preferred</Typography>
                        <Typography sx={metaDataText}>{itemsResultsMeta.preferred || 0}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={metaDataLabel}>Preferred Magelo</Typography>
                        <Typography sx={metaDataText}>
                            {itemsResultsMeta.preferredMagelo || 0}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={metaDataLabel}>Main</Typography>
                        <Typography sx={metaDataText}>{itemsResultsMeta.main || 0}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={metaDataLabel}>Alt</Typography>
                        <Typography sx={metaDataText}>{itemsResultsMeta.alt || 0}</Typography>
                    </Box>
                </Box>
                {isAuthenticated && isSuperUser && onEditClick && (
                    <Box
                        onClick={onEditClick}
                        sx={{
                            color: '#9ca3af',
                            fontSize: '24px',
                            cursor: 'pointer',
                            transition: 'color 0.2s',
                            userSelect: 'none',
                            '&:hover': {
                                color: '#fff',
                            },
                            '&:active': {
                                color: '#696969',
                            },
                        }}
                    >
                        EDIT
                    </Box>
                )}
            </Box>
        </Box>
    );
};
// TODO: Does this belong in utils file?
export const getItemAwardedMetaData = (itemsResults, filteredDataLen) => {
    if (!itemsResults) return [];

    const itemsResultsMeta = _getItemsResultsMeta(itemsResults);
    return (
        <>
            <Typography sx={{ ...labelStyles, fontSize: '0.8rem', mt: 2 }}>
                Total Items Shown: {filteredDataLen}
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 3,
                    mt: 2,
                    mb: 1,
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <MetaDetail label={'Magelo Main'} val={itemsResultsMeta.mageloMain || 0} />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <MetaDetail label={'Magelo Alt'} val={itemsResultsMeta.mageloAlt || 0} />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <MetaDetail label={'Preferred'} val={itemsResultsMeta.preferred || 0} />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <MetaDetail
                        label={'Preferred Magelo'}
                        val={itemsResultsMeta.preferredMagelo || 0}
                    />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <MetaDetail label={'Main'} val={itemsResultsMeta.main || 0} />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <MetaDetail label={'Alt'} val={itemsResultsMeta.alt || 0} />
                </Box>
            </Box>
        </>
    );
};

export const sortRaData = raData => {
    return raData.sort((a, b) => {
        const valA = a.created_at;
        const valB = b.created_at;
        return valB.localeCompare(valA);
    });
};

export const _parseDate = (str) => {
    const [month, day, year] = str.split('-');
    return new Date(`20${year}`, month - 1, day);
};

export const sortItemsByRaidDate = (results, desc = true) => {
    return results.sort((a, b) => {
        const raidA = a.raid ? a.raid.created_at : a.created_at;
        const raidB = b.raid ? b.raid.created_at : b.created_at;
        const dateA = _parseDate(raidA);
        const dateB = _parseDate(raidB);
        return desc ? dateB - dateA : dateA - dateB;
    })
}
