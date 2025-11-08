import {useRaidList} from "../hooks/requests.js";
import React from "react";
import {RaidListTable} from "../components/RaidListTable.jsx";

export function RaidListView() {
    const {data, isPending, error} = useRaidList("/raids/");

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;

    return <RaidListTable data={data} rowStyles={{
        '& .MuiTableCell-root': {
            padding: '4px',
        },
        height: '36px',
    }}/>
}
