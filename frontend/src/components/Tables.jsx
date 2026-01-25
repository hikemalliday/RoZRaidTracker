import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Link } from 'react-router';
import React, { useEffect, useState } from 'react';
import { IMAGE_PATH } from '../config.js';

export const getLinkCell = (val, route, extraText) => {
    return (
        <TableCell id="clickable-cell">
            <Link to={route}>{val}</Link>
            <span id={extraText?.id}>{extraText?.text}</span>
        </TableCell>
    );
};

export const getCell = val => {
    return <TableCell id="non-clickable-cell">{val}</TableCell>;
};

export const getItemIconCell = iconId => {
    return (
        <TableCell id="non-clickable-cell">
            <img id="item-icon" src={`${IMAGE_PATH}/item_${iconId}.png`} alt={'null'} />
        </TableCell>
    );
};

export const getCheckboxCell = changeHandler => {
    return (
        <TableCell>
            <input type="checkbox" onChange={e => changeHandler(e)} />
        </TableCell>
    );
};

export const getCheckboxCellControlled = (changeHandler, state) => {
    return (
        <TableCell>
            <input type="checkbox" checked={state} onChange={e => changeHandler(e)} />
        </TableCell>
    );
};

export const getLootTypeBadgeCell = lootType => {
    const getBadgeStyle = type => {
        if (!type) return null;
        const typeUpper = type.toUpperCase();
        // Preferred -> yellow
        if (typeUpper.includes('PREFERRED')) {
            return {
                background: 'rgba(234, 179, 8, 0.15)',
                color: '#facc15',
                border: '1px solid rgba(234, 179, 8, 0.3)',
            };
        }
        // Preferred + Magelo -> gold
        if (typeUpper.includes('PREFERRED') && typeUpper.includes('MAGELO')) {
            return {
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                border: '1px solid rgba(245, 158, 11, 0.3)',
            };
        }
        // Main, Magelo -> red
        if (typeUpper.includes('MAIN') && typeUpper.includes('MAGELO')) {
            return {
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.3)',
            };
        }
        // Alt, Magelo -> orange
        if (typeUpper.includes('ALT') && typeUpper.includes('MAGELO')) {
            return {
                background: 'rgba(249, 115, 22, 0.15)',
                color: '#fb923c',
                border: '1px solid rgba(249, 115, 22, 0.3)',
            };
        }
        // Alt -> purple
        if (typeUpper.includes('ALT')) {
            return {
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#a78bfa',
                border: '1px solid rgba(139, 92, 246, 0.3)',
            };
        }
        // Main (without Magelo) -> gray
        if (typeUpper.includes('MAIN')) {
            return {
                background: 'rgba(107, 114, 128, 0.15)',
                color: '#9ca3af',
                border: '1px solid rgba(107, 114, 128, 0.3)',
            };
        }
        return null;
    };

    const badgeStyle = getBadgeStyle(lootType);

    if (!badgeStyle) {
        return <TableCell id="non-clickable-cell">{lootType}</TableCell>;
    }

    return (
        <TableCell id="non-clickable-cell">
            <Box
                sx={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: badgeStyle.border,
                    background: badgeStyle.background,
                    color: badgeStyle.color,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                    letterSpacing: '0.3px',
                }}
            >
                {lootType}
            </Box>
        </TableCell>
    );
};

// Order of keys in 'headerMap' matters, as the keys are used for rendering cols / headers
export function TableList({
    data,
    getTableRows,
    headerMap = {},
    sortable = false,
    styledRows = false,
    dataTestId = null,
}) {
    const [sorted, setSorted] = useState(data);
    const [sortDirection, setSortDirection] = useState('asc');
    const reducedData = getTableRows(sorted);

    useEffect(() => {
        setSorted(data);
    }, [data]);

    const _getNestedValue = (obj, path) => {
        return path.split('.').reduce((current, key) => {
            return current && typeof current === 'object' ? current[key] : undefined;
        }, obj);
    };

    const _sortByCol = header => {
        if (!header) return;
        const colToSortBy = headerMap[header];

        if (!colToSortBy) return;

        const newSorted = [...sorted].sort((a, b) => {
            const valA = _getNestedValue(a, colToSortBy);
            const valB = _getNestedValue(b, colToSortBy);

            if (valA == null || valB == null) {
                return valA == null ? 1 : -1;
            }

            const sortMapString = {
                asc: () => {
                    setSortDirection('desc');
                    return valB.localeCompare(valA);
                },
                desc: () => {
                    setSortDirection('asc');
                    return valA.localeCompare(valB);
                },
            };

            const sortMapNumber = {
                asc: () => {
                    setSortDirection('desc');
                    return valB - valA;
                },
                desc: () => {
                    setSortDirection('asc');
                    return valA - valB;
                },
            };

            const dataType = typeof valA;
            return dataType === 'string'
                ? sortMapString[sortDirection]()
                : sortMapNumber[sortDirection]();
        });
        return setSorted(newSorted);
    };

    const _getHeaderId = header => {
        const headerMapVal = headerMap[header];
        return headerMapVal && sortable ? 'table-header-sortable' : 'table-header';
    };

    return (
        <Table
            sx={{
                width: '100%',
                borderCollapse: 'collapse',
            }}
            data-testid={dataTestId ? `table-list-${dataTestId}` : `table-list-test-id`}
        >
            <TableHead>
                <TableRow>
                    {Object.entries(headerMap).map(([header, _], i) => {
                        return (
                            <TableCell
                                key={i}
                                id={_getHeaderId(header)}
                                onClick={_ => (sortable ? _sortByCol(header) : null)}
                            >
                                {header}
                            </TableCell>
                        );
                    })}
                </TableRow>
            </TableHead>
            <TableBody>
                {reducedData.map(row => {
                    return row;
                })}
            </TableBody>
        </Table>
    );
}
