import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {Link} from "react-router";
import React, {useState} from "react";


export const getLinkCell = (val, route, extraText) => {
    return (
        <TableCell id="clickable-cell">
            <Link to={route}>
                {val}
            </Link>
            <span id={extraText?.id}>{extraText?.text}</span>
        </TableCell>
    )
}

export const getCell = (val) => {
    return (
        <TableCell id="non-clickable-cell">
            {val}
        </TableCell>
    )
}

export const getItemIconCell = (iconId) => {
    return (
        <TableCell id="non-clickable-cell">
            <img
                id="item-icon"
                src={`/item_icons/item_${iconId}.png`}
                alt={"null"}
            />
        </TableCell>
    )
}

// Order of keys in 'headerMap' matters, as the keys are used for rendering cols / headers
export function TableList({data, getTableCells, headerMap = {} }) {
    const [sorted, setSorted] = useState(data);
    const [sortDirection, setSortDirection] = useState('asc');
    const reducedData = getTableCells(sorted);

    const _sortByCol = (header) => {
        if (!header) return;
        const colToSortBy = headerMap[header];

        if (!colToSortBy) return;

        const newSorted = [...sorted].sort((a, b) => {
            const sortMapString = {
                "asc": () => {
                    setSortDirection("desc");
                    return b[colToSortBy].localeCompare(a[colToSortBy]);
                },
                "desc": () => {
                    setSortDirection("asc");
                    return a[colToSortBy].localeCompare(b[colToSortBy]);
                },
            }

            const sortMapNumber = {
                "asc": () => {
                    setSortDirection("desc");
                    return b[colToSortBy] - a[colToSortBy];
                },
                "desc": () => {
                    setSortDirection("asc");
                    return a[colToSortBy] - b[colToSortBy];
                }
            }

            const dataType = typeof sorted[0][colToSortBy];
            return dataType === "string"  ? sortMapString[sortDirection]() : sortMapNumber[sortDirection]();
        });
        return setSorted(newSorted);
    }

    const _getHeaderId = (header) => {
        const headerMapVal = headerMap[header];
        return headerMapVal ? "table-header-sortable" : "table-header";
    }


    return (
        <Table>
            <TableHead>
                <TableRow>
                    {Object.entries(headerMap).map(([header, _], i) => {
                        return (
                            <TableCell key={i} id={_getHeaderId(header)} onClick={(_) => _sortByCol(header)}>
                                {header}
                            </TableCell>
                        )
                    })}
                </TableRow>
            </TableHead>
            <TableBody>
                {reducedData.map((row, i) => {
                    return (
                        <TableRow key={i}>
                            {row.map((cell) => {
                                return cell
                            })}
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}