import {ListView} from "./generic/ListView.jsx";
import {useRaids} from "../hooks/requests.js";

export function RaidListView() {
    const {data, isLoading, error} = useRaids("/raids/");

    if (isLoading) return <>LOADING...</>;

    return <ListView title="Raids" accessor="name" data={data}/>
}
