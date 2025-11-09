import { usePlayerListPaginated } from '../hooks/requests.js';
import { PlayerListTable } from '../components/PlayerListTable.jsx';
import { PaginatedListTable } from '../components/PaginatedListTable.jsx';

export function PlayerListView() {
    return (
        <PaginatedListTable
            requestHook={usePlayerListPaginated}
            TableComponent={PlayerListTable}
            sortChoices={['name', 'lifetime_ra']}
        />
    );
}
