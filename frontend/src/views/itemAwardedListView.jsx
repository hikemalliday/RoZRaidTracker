import {useItemAwardedList} from "../hooks/requests.js";
import {ItemAwardedListTable} from "../components/ItemAwardedListTable.jsx";

export function ItemAwardedListView() {
    const {data, isPending, error} = useItemAwardedList();

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;

    return <ItemAwardedListTable data={data}/>
}
