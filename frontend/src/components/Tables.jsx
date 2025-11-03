import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {Link} from "react-router";
import React from "react";


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

// 'reducedData' is a 2d array, where each child array is the cells to render in a row
export function TableList({headers, reducedData}) {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    {headers.map((header, i) => {
                        return (
                            <TableCell key={i} id="table-header">
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