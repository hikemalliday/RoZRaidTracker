import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Link } from 'react-router';
import React, { useEffect, useState } from 'react';
import { IMAGE_PATH } from '../config.js';
import { fixLinks, getItemInfo } from '../views/utils.jsx';

export function getHoverTooltipCell(val, itemId) {
    const [itemHtml, setItemHtml] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = async () => {
        setHovered(true);
        if (!itemHtml && !isLoading) {
            setIsLoading(true);
            const html = await getItemInfo(itemId);
            setItemHtml(fixLinks(html));
            setIsLoading(false);
        }
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    return (
        <TableCell
            className="tooltip-wrapper"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {val}
            {hovered && itemHtml && (
                <div className="tooltip-content" dangerouslySetInnerHTML={{ __html: itemHtml }} />
            )}
            {hovered && !itemHtml && <div className="tooltip-content">Loading...</div>}
        </TableCell>
    );
}

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
            sx={
                styledRows
                    ? {
                          borderCollapse: 'separate',
                          borderSpacing: '0 8px', // 0 horizontal, 8px vertical gap between rows
                      }
                    : {}
            }
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
