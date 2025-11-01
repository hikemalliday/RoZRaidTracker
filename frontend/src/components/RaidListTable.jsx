import {getCell, getLinkCell, TableList} from "./Tables.jsx";
import React from "react";

export function RaidListTable({ data }) {
    const getRaidCells = (data) => {
        return data.map((row) => {
            return [
                getLinkCell(row?.name, `/raid/${row?.id}`),
                getCell(row?.zone?.name),
                getCell(row?.created_at),
            ]
        })
    };

    const headers = ["Name", "Zone", "Date"];
    return <TableList headers={headers} reducedData={getRaidCells(data)}/>
}