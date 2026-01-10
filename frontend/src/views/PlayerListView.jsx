import { usePlayerListPaginated, usePlayersList } from '../hooks/requests.js';
import { PlayerListTable } from '../components/PlayerListTable.jsx';
import { PaginatedListTable } from '../components/PaginatedListTable.jsx';
import { getPlayersListFinal } from './utils.jsx';

export function PlayerListView() {
    return (
        <PaginatedListTable
            requestHook={usePlayerListPaginated}
            TableComponent={PlayerListTable}
            sortChoices={['name', 'lifetime ra', '21 day']}
            searchParam="name"
            useOptions={usePlayersList}
            optionsLabel="players"
            reduceOptions={getPlayersListFinal}
            sortMap={{
                '21 day': 'ra_21_day',
                'lifetime ra': 'lifetime_ra',
            }}
            defaultSort={{
                orderDir: 'desc',
                ordering: '21 day',
            }}
        />
    );
}
