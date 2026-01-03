import { usePlayerListPaginated, usePlayersList } from '../hooks/requests.js';
import { PlayerListTable } from '../components/PlayerListTable.jsx';
import { PaginatedListTable } from '../components/PaginatedListTable.jsx';
import { getPlayersListFinal } from './utils.jsx';

export function PlayerListView() {
    return (
        <PaginatedListTable
            requestHook={usePlayerListPaginated}
            TableComponent={PlayerListTable}
            sortChoices={['name', 'lifetime_ra']}
            searchParam="name"
            useOptions={usePlayersList}
            optionsLabel="players"
            reduceOptions={getPlayersListFinal}
        />
    );
}
