import { useRaidListPaginated } from '../hooks/requests.js';
import React from 'react';
import { RaidListTable } from '../components/RaidListTable.jsx';
import { PaginatedListTable } from '../components/PaginatedListTable.jsx';

export function RaidListView() {
    return (
        <PaginatedListTable
            requestHook={useRaidListPaginated}
            TableComponent={RaidListTable}
            sortChoices={['name', 'zone', 'date']}
            sortMap={{ date: 'created_at' }}
        />
    );
}
