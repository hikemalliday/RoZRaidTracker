import { useItemAwardedList } from '../hooks/requests.js';
import { ItemAwardedListTable } from '../components/ItemAwardedListTable.jsx';
import { PaginatedListTable } from '../components/PaginatedListTable.jsx';

export function ItemAwardedListView() {
    return (
        <PaginatedListTable
            requestHook={useItemAwardedList}
            TableComponent={ItemAwardedListTable}
            sortChoices={['name', 'player', 'raid', 'date']}
        />
    );
}
