import {ListView} from "./generic/ListView.jsx";
import {useItemsAwarded} from "../hooks/requests.js";
import axios from "axios";

export function ItemAwardedListView() {
    const {data, isPending, error} = useItemsAwarded("/items_awarded/");

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
                "raid": itemAwarded.raid.name,
                "date": itemAwarded.created_at,
                "iconId": itemAwarded.item.icon_id,
            }
        })
    };

    const table = (rows) => {
        return (
            <table>
                <thead>
                <tr>
                    <th>
                        Name
                    </th>
                    <th>
                        Player
                    </th>
                    <th>
                        Raid
                    </th>
                    <th>
                        Date
                    </th>
                    <th>
                        Icon
                    </th>
                </tr>
                </thead>
                <tbody>
                {rows.map((row) => {
                    return (
                        <tr>
                            <td>
                                {row.name}
                            </td>
                            <td>
                                {row.player}
                            </td>
                            <td>
                                {row.raid}
                            </td>
                            <td>
                                {row.date}
                            </td>
                            <td>
                                <img
                                    src={getIconPath(row.iconId)}
                                    alt={row.name}
                                />
                                {row.icon}
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        )
    };

    return table(getItemAwardedRows(data));

    // return <ListView title="Items Awarded" accessor="name" data={data}/>
}
