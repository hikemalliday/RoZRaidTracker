import { ListView } from "./generic/ListView.jsx";
import { ITEM_AWARDED_LIST } from "../tests/mocks/mockData.js";

export function ItemAwardedListView() {
    return <ListView title="Items Awarded" accessor="name" data={ITEM_AWARDED_LIST}/>
}
