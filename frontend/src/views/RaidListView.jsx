import {useRaidList} from "../hooks/requests.js";
import React from "react";
import {getRaidRows, getRaidTable} from "./utils.jsx"

export function RaidListView() {
    const {data, isPending, error} = useRaidList("/raids/");

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;

    return getRaidTable(getRaidRows(data));
}
