import {ListView} from "./generic/ListView.jsx";
import {useRaids} from "../hooks/requests.js";

export function RaidListView() {
    const {data, isPending, error} = useRaids("/raids/");

    if (isPending) return <>LOADING...</>;

    if (error) return <>{error.message}</>;

    return <ListView title="Raids" accessor="name" data={data}/>
}
