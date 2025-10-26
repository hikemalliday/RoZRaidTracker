import {ListView} from "./generic/ListView.jsx";
import {usePlayers} from "../hooks/requests.js";

export function PlayerListView() {
    const {data, isPending, error} = usePlayers("/players/");

    if (isPending) return <>LOADING...</>;

    if (error) return <>{error.message}</>;

    return <ListView title="Players" accessor="name" data={data}/>
}
