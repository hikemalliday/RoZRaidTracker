import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {Link} from "react-router";
import React from "react";


// TODO: Eventually bundle these two together into a component, data + table
export const getItemAwardedRows = (itemsAwardedData) => {
    return itemsAwardedData.map((itemAwarded) => {
        return {
            "name": itemAwarded.item.name,
            "player": itemAwarded.player.name,
            "playerId": itemAwarded.player.id,
            "raid": itemAwarded.raid.name,
            "raidId": itemAwarded.raid.id,
            "date": itemAwarded.created_at,
            "iconId": itemAwarded.item.icon_id,
        }
    })
};


export const getItemAwardedTable = (rows) => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell id="table-header">
                    </TableCell>
                    <TableCell id="table-header">
                        Name
                    </TableCell>
                    <TableCell id="table-header">
                        Player
                    </TableCell>
                    <TableCell id="table-header">
                        Raid
                    </TableCell>
                    <TableCell id="table-header">
                        Date
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row) => {
                    return (
                        <TableRow id="table-row">
                            <TableCell id="non-clickable-cell">
                                <img
                                    id="item-icon"
                                    src={`/item_icons/item_${row.iconId}.png`}
                                    alt={row.name}
                                />
                                {row.icon}
                            </TableCell>
                            <TableCell id="non-clickable-cell">
                                {row.name}
                            </TableCell>
                            <TableCell id="clickable-cell">
                                <Link to={`/player/${row?.playerId}`}>
                                    {row.player}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <Link to={`/raid/${row?.raidId}`}>
                                    {row.raid}
                                </Link>
                            </TableCell>
                            <TableCell id="non-clickable-cell">
                                {row.date}
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
};


// TODO: Eventually bundle these two together into a component, data + table
export const getRaRows = (raData) => {
    return raData.map((ra) => {
        return {
            "id": ra.id,
            "raid": ra.raid,
            "zone": ra.zone,
            "player": ra.player,
            "date": ra.created_at,
        }
    })
}

export const getRaTable = (rows) => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell id="table-header">Raid</TableCell>
                    <TableCell id="table-header">Zone</TableCell>
                    <TableCell id="table-header">Player</TableCell>
                    <TableCell id="table-header">Date</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row) => {
                    return (
                        <TableRow>
                            <TableCell id="clickable-cell">
                                <Link to={`/raid/${row?.raid?.id}`}>
                                    {row?.raid.name}
                                </Link>
                            </TableCell>
                            <TableCell id="non-clickable-cell">{row?.raid.zone?.name || "null"}</TableCell>
                            <TableCell id="clickable-cell">
                                <Link to={`/player/${row?.player?.id}`}>
                                    {row?.player?.name || "null"}
                                </Link>
                            </TableCell>
                            <TableCell id="non-clickable-cell">{row?.date}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}


export const getCharacterRows = (characterData) => {
    const _getCharStatus = (char) => {
        if (char.is_main) return "Main";
        if (char.is_main_alt) return "Main Alt";
        return "Alt";
    }

    return characterData.map((char) => {
        return {
            "id": char.id,
            "name": char.name,
            "charClass": char?.char_class,
            "status": _getCharStatus(char),
            "player": char?.player?.name,
            "playerId": char?.player?.id,
        }
    });
}

export const getCharacterTable = (rows) => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell id="table-header">Name</TableCell>
                    <TableCell id="table-header">Class</TableCell>
                    <TableCell id="table-header">Status</TableCell>
                    <TableCell id="table-header">Player</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row) => {
                    return (
                        <TableRow>
                            <TableCell id="clickable-cell">
                                <Link to={`/character/${row?.id}`}>
                                    {row?.name}
                                </Link>
                            </TableCell>
                            <TableCell id="non-clickable-cell">{row?.charClass || "null"}</TableCell>
                            <TableCell id="non-clickable-cell">{row?.status || "null"}</TableCell>
                            <TableCell id="clickable-cell">
                                <Link to={`/player/${row?.playerId}`}>
                                    {row?.player || "null"}
                                </Link>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
};


export const getRaidRows = (raidsData) => {
    return raidsData.map((raid) => {
        return {
            "id": raid.id,
            "name": raid.name,
            "date": raid.created_at,
            "zone": raid.zone,
        }
    })
};

export const getRaidTable = (rows) => {
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
                            <TableCell id="clickable-cell">
                                <Link to={`/raid/${row?.id}`}>
                                    {row?.name || "null"}
                                </Link>
                            </TableCell>
                            <TableCell id="non-clickable-cell">{row?.zone?.name || "null"}</TableCell>
                            <TableCell id="non-clickable-cell">{row?.date || "null"}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}
