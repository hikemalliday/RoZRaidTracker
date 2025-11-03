import {getCell, getLinkCell, TableList} from "./Tables.jsx";
import React from "react";
import {TableRow} from "@mui/material";

export function RaidListTable({ data }) {
    const getRaidRows = (data) => {
        return data.map((row, i) => {
            return (
                <TableRow key={i}>
                    {getLinkCell(row?.name, `/raid/${row?.id}`)}
                    {getCell(row?.zone?.name)}
                    {getCell(row?.created_at)}
                </TableRow>
            )
        })
    };

    const headerMap = {
        "Name": "name",
        "Zone": "zone.name",
        "Date": "created_at",
    }
    return <TableList headerMap={headerMap} data={data} getTableRows={getRaidRows}/>
}