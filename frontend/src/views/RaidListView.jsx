import {useRaidList} from "../hooks/requests.js";
import React from "react";
import {getCell, getLinkCell, TableList} from "../components/Tables.jsx";

export function RaidListView() {
    const {data, isPending, error} = useRaidList("/raids/");

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;

    const getRaidCells = (data) => {
        return data.map((row) => {
            return [
                getLinkCell(row?.name, `/raid/${row?.id}`),
                getCell(row?.zone?.name),
                getCell(row?.date),
            ]
        })
    };

    const headers = ["Name", "Zone", "Date"];
    return <TableList headers={headers} reducedData={getRaidCells(data)}/>
}
