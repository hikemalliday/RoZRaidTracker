import {ListView} from "./generic/ListView.jsx";
import {useItemsAwarded} from "../hooks/requests.js";

export function ItemAwardedListView() {
    const {data, isLoading, error} = useItemsAwarded("/items_awarded/");

    if (isLoading) return <>LOADING...</>;

    return <ListView title="Items Awarded" accessor="name" data={data}/>
}
