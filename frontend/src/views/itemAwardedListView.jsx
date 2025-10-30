import {ListView} from "./generic/ListView.jsx";
import {useItemsAwarded} from "../hooks/requests.js";
import axios from "axios";
import {useNavigate} from "react-router";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";

export function ItemAwardedListView() {
    const navigate = useNavigate();
    const {data, isPending, error} = useItemsAwarded("/items_awarded/");

    const handleClick = (view, id) => {
        return navigate(`/${view}/${id}`, {replace: true});
    }
    const getIconPath = (iconId) => {
        return `/item_icons/item_${iconId}.png`;
    };

    if (isPending) return <>LOADING...</>;

    if (error) return <>{error.message}</>;

    const getItemAwardedRows = (itemsAwardedData) => {
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

    const table = (rows) => {
        return (
            <Table >
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
                        <TableRow>
                            <TableCell id="clickable-cell">
                                <img
                                    id="item-icon"
                                    src={getIconPath(row.iconId)}
                                    alt={row.name}
                                />
                                {row.icon}
                            </TableCell>
                            <TableCell id="clickable-cell">
                                {row.name}
                            </TableCell>
                            <TableCell id="clickable-cell" onClick={(_) => handleClick("players", row.playerId)}>
                                {row.player}
                            </TableCell>
                            <TableCell id="clickable-cell" onClick={(_) => handleClick("raids", row.raidId)}>
                                {row.raid}
                            </TableCell>
                            <TableCell id="clickable-cell">
                                {row.date}
                            </TableCell>

                        </TableRow>
                    )
                })}
                </TableBody>
            </Table >
        )
    };

    return table(getItemAwardedRows(data));

    // return <ListView title="Items Awarded" accessor="name" data={data}/>
}
