import {useItemAwardedList} from "../hooks/requests.js";
import {getItemAwardedRows, getItemAwardedTable} from "./utils.jsx";

export function ItemAwardedListView() {
    const {data, isPending, error} = useItemAwardedList();

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;

    return getItemAwardedTable(getItemAwardedRows(data));
}
