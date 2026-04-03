import { useItemAwardedListPaginated, useItemOptionsList } from '../hooks/requests.js';
import { ItemAwardedListTable } from '../components/ItemAwardedListTable.jsx';
import { PaginatedListTable } from '../components/PaginatedListTable.jsx';
import { getItemOptionsListFinal } from './utils.jsx';

export function ItemAwardedListView() {
    return (
        <PaginatedListTable
            requestHook={useItemAwardedListPaginated}
            TableComponent={ItemAwardedListTable}
            sortChoices={['name', 'player', 'raid', 'date', 'raid_date']}
            sortMap={{
                name: 'item__name',
                player: 'player__name',
                date: 'created_at',
                raid: 'raid__name',
                raid_date: 'raid__created_at',
            }}
            defaultSort={{
                orderDir: 'desc',
                ordering: 'raid_date',
            }}
            autoCompleteOptions={{
                searchParam: 'item__id',
                optionsLabel: 'item name',
                useOptions: useItemOptionsList,
                reduceOptions: getItemOptionsListFinal,
                useOptionLabel: false,
            }}
        />
    );
}
