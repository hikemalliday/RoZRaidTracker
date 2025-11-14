import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
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

// Order of keys in 'headerMap' matters, as the keys are used for rendering cols / headers
export function TableList({ data, getTableRows, headerMap = {}, sortable = false }) {
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
        return headerMapVal ? 'table-header-sortable' : 'table-header';
    };

    return (
        <Table>
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
