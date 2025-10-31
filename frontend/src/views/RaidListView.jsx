import {ListView} from "./generic/ListView.jsx";
import {useRaids} from "../hooks/requests.js";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import React from "react";
import {useNavigate} from "react-router";

export function RaidListView() {
    const navigate = useNavigate();
    const {data, isPending, error} = useRaids("/raids/");

    if (isPending) return <>LOADING...</>;

    if (error) return <>{error.message}</>;

    console.log('data Raid list:');
    console.log(data);

    const getRaidsRows = (raidsData) => {
      return raidsData.map((raid) => {
          return {
              "id": raid.id,
              "name": raid.name,
              "date": raid.created_at,
              "zone": raid.zone,
          }
      })
    };

    const handleClick = (view, id) => {
        return navigate(`/${view}/${id}`, {replace: true});
    }

    const table = (rows) => {
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell id="table-header">Name</TableCell>
                        <TableCell id="table-header">Zone</TableCell>
                        <TableCell id="table-header">Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => {
                        return (
                            <TableRow>
                                <TableCell id="clickable-cell" onClick={(_) => handleClick("raids", row?.id)}>{row?.name || "null"}</TableCell>
                                <TableCell id="non-clickable-cell">{row?.zone?.name || "null"}</TableCell>
                                <TableCell id="non-clickable-cell">{row?.data || "null"}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        )
    }
    return table(getRaidsRows(data));
}
