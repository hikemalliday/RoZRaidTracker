import {ListView} from "./generic/ListView.jsx";
import {usePlayers} from "../hooks/requests.js";

export function PlayerListView() {
    const {data, isLoading, error} = usePlayers("/players/");

    if (isLoading) return <>LOADING...</>;

    return <ListView title="Players" accessor="name" data={data}/>
}
