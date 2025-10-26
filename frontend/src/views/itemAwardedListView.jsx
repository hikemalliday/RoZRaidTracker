import {ListView} from "./generic/ListView.jsx";
import {useItemsAwarded} from "../hooks/requests.js";

export function ItemAwardedListView() {
    const {data, isPending, error} = useItemsAwarded("/items_awarded/");

    if (isPending) return <>LOADING...</>;

    if (error) return <>{error.message}</>;


    return <ListView title="Items Awarded" accessor="name" data={data}/>
}
