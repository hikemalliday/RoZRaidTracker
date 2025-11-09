import { useRaidList } from '../hooks/requests.js';
import React from 'react';
import { RaidListTable } from '../components/RaidListTable.jsx';
import { PaginatedListTable } from '../components/PaginatedListTable.jsx';

export function RaidListView() {
    return (
        <PaginatedListTable
            requestHook={useRaidList}
            TableComponent={RaidListTable}
            sortChoices={['name', 'zone', 'date']}
        />
    );
}
