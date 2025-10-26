import { ListView } from "./generic/ListView.jsx";
import { PLAYER_LIST } from "../tests/mocks/mockData.js";

export function PlayerListView() {
    return <ListView title="Players" accessor="name" data={PLAYER_LIST}/>
}
