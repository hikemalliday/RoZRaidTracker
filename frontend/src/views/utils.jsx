import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";

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

export const getItemAwardedTable = (rows, clickHandler) => {
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
                            <TableCell id="clickable-cell">
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
                            <TableCell id="clickable-cell" onClick={(_) => clickHandler("player", row.playerId)}>
                                {row.player}
                            </TableCell>
                            <TableCell id="clickable-cell" onClick={(_) => clickHandler("raid", row.raidId)}>
                                {row.raid}
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