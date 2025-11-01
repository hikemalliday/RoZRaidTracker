import {usePlayerList} from "../hooks/requests.js";
import {PlayerListTable} from "../components/PlayerListTable.jsx";


export function PlayerListView() {
    const {data, isPending, error} = usePlayerList();

    if (isPending) return <>LOADING...</>;
    if (error) return <>{error.message}</>;

    return <PlayerListTable data={data} />
}
