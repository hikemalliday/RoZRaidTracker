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

const _getReducedPlayersOptionsRaidAttendanceApproval = players => {
    const options = [];
    for (const player of players) {
        if (player.characters.length === 0) {
            options.push({
                id: player.id,
                value: [player.name, player.discord_id],
                name: player.name,
                label: player.name,
                discord_id: player.discord_id,
            });
            continue;
        }
        for (const character of player.characters) {
            options.push({
                id: player.id,
                value: [player.name, player.discord_id],
                name: player.name,
                label: `${player.name} | ${character.name}`,
                discord_id: player.discord_id,
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

export const getPlayersOptionsRaidAttendanceApproval = results => {
    if (!results) return [];
    const reducedList = _getReducedPlayersOptionsRaidAttendanceApproval(results);
    return _sortReducedList(reducedList)
}

export const getItemOptionsListFinal = results => {
    return _getReduceItemAwardedResults(results);
};

export function joinAndTruncate(array, truncateLength = 50) {
    return array.join(', ').slice(0, truncateLength) + '...';
}

export function getLootType(itemObj) {
    const typeMap = {
        "preferred": "Preferred",
        "preferred_magelo": "Preferred, Magelo",
        "main_magelo": "Main, Magelo",
        "alt_magelo": "Alt, Magelo",
        "alt": "Alt",
        "main": "Main",
        "main_alt": "Main Alt"
    }
    return typeMap[itemObj.type];
}

export async function getItemInfo(itemId) {
    try {
        const res = await fetch(`https://www.pqdi.cc/get-item-tooltip/${itemId}`);
        return await res.text();
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
        if (item.type === 'main') resultsObj["Main"] = resultsObj["Main"] ? (resultsObj["Main"] += 1) : 1;
        if (item.type === 'alt') resultsObj["Alt"] = resultsObj["Alt"] ? (resultsObj["Alt"] += 1) : 1;
        if (item.type === 'main_magelo')
            resultsObj["Main Magelo"] = resultsObj["Main Magelo"] ? (resultsObj["Main Magelo"] += 1) : 1;
        if (item.type === 'alt_magelo')
            resultsObj["Alt Magelo"] = resultsObj["Alt Magelo"] ? (resultsObj["Alt Magelo"] += 1) : 1;
        if (item.type === 'preferred')
            resultsObj["Preferred"] = resultsObj["Preferred"] ? (resultsObj["Preferred"] += 1) : 1;
        if (item.type === 'preferred_magelo')
            resultsObj["Preferred Magelo"] = resultsObj["Preferred Magelo"]
                ? (resultsObj["Preferred Magelo"] += 1)
                : 1;
        if (item.type === 'main_alt')
            resultsObj["Main Alt"] = resultsObj["Main Alt"] ? (resultsObj["Main Alt"] += 1) : 1;
        if (item.item.tier === 'QUARM')
            resultsObj["Quarm"] = resultsObj["Quarm"] ? (resultsObj["Quarm"] += 1) : 1;
        if (item.item.tier === 'TIME')
            resultsObj["Time"] = resultsObj["Time"] ? (resultsObj["Time"] += 1) : 1;
        if (item.item.tier === 'ELEMENTAL')
            resultsObj["Elemental"] = resultsObj["Elemental"] ? (resultsObj["Elemental"] += 1) : 1;
        if (item.item.tier === 'PRE-ELEMENTAL')
            resultsObj["Pre-Elemental"] = resultsObj["Pre-Elemental"] ? (resultsObj["Pre-Elemental"] += 1) : 1;
    });
    return resultsObj;
};
// TODO: Does this belong in utils file?
// TODO: Why do we have an editable and regular version of this? What is the diff? Can these be consolidated?
export const getItemAwardedMetaDataEditable = (
    itemsResults,
    isAuthenticated = false,
    isSuperUser = false,
    onEditClick = null
) => {
    if (!itemsResults) return null;

    const getMetaElements = (meta) => {
        return Object.entries(meta).map(([key, val], i) => {
              return (
                  <Box key={i} sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography sx={metaDataLabel}>{key}</Typography>
                      <Typography sx={metaDataText}>
                          {val}
                      </Typography>
                  </Box>
              )
          })
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
                    {getMetaElements(itemsResultsMeta)}
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

    const getMetaElements = results => {
        return Object.entries(results).map(([key, val], i) => {
             return (
                 <Box key={i} sx={{ textAlign: 'center' }}>
                     <MetaDetail label={key} val={val} />
                 </Box>
             )
        });
    }

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
                {getMetaElements(itemsResultsMeta)}
            </Box>
        </>
    );
};

const _parseDate = (str) => {
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
