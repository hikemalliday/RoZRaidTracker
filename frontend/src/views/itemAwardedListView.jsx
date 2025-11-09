import { useItemAwardedListPaginated } from '../hooks/requests.js';
import { ItemAwardedListTable } from '../components/ItemAwardedListTable.jsx';
import { PaginatedListTable } from '../components/PaginatedListTable.jsx';

export function ItemAwardedListView() {
    return (
        <PaginatedListTable
            requestHook={useItemAwardedListPaginated}
            TableComponent={ItemAwardedListTable}
            sortChoices={['name', 'player', 'raid', 'date']}
        />
    );
}
