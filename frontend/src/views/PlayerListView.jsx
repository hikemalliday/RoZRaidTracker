import { useList, usePlayerListPaginated } from '../hooks/requests.js';
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
            useOptions={useList}
            optionsHookParams={{
                optionsQueryKey: 'players',
                optionsRoute: '/players/',
            }}
            getOptions={getPlayersListFinal}
        />
    );
}
