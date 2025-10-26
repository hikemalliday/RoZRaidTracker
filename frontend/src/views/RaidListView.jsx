import { ListView } from "./generic/ListView.jsx";
import { RAID_LIST } from "../tests/mocks/mockData.js";

export function RaidListView() {
    return <ListView title="Raids" accessor="name" data={RAID_LIST}/>
}
