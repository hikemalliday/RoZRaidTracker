import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {Link} from "react-router";
import React from "react";


export const getLinkCell = (val, route, extraText) => {
    // extraVal is used to tag add more text in that you don't want linked, for example a character's class
    // Is it an object so that you can provide element id
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
        <TableCell id="clickable-cell">
            {val}
        </TableCell>
    )
}

// Now try to implement this in the easiest spot possible. Also, cell.Va
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