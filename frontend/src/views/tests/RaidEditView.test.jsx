import { describe, expect, test } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderRouteWithContext } from '../../testUtils.jsx';
import { RaidEditView } from '../RaidEditView.jsx';
import {
    ITEM_AWARDED_LIST,
    RAID_1_ID,
    RAID_ATTENDANCE_LIST,
    RAID_LIST,
} from '../../tests/mocks/mockData.js';

const renderRaidEdit = () => renderRouteWithContext(true, {
    route: [`/raid/${RAID_1_ID}/edit`],
    path: '/raid/:id/edit',
    element: <RaidEditView />,
});

describe('RaidEditView', () => {
    test('renders a loading state while raid edit data is requested', () => {
        renderRaidEdit();

        expect(screen.getByText('LOADING...')).toBeInTheDocument();
    });

    test('renders the selected raid and its awarded items', async () => {
        renderRaidEdit();

        await waitFor(() => expect(screen.queryByText('LOADING...')).not.toBeInTheDocument());

        const raid = RAID_LIST.find(record => record.id === RAID_1_ID);
        expect(screen.getByText('Raid').parentElement).toHaveTextContent(raid.name);
        expect(screen.getByText('Date').parentElement).toHaveTextContent(raid.created_at);

        for (const award of ITEM_AWARDED_LIST.filter(award => award.raid.id === RAID_1_ID)) {
            expect(await screen.findByDisplayValue(award.item.name)).toBeInTheDocument();
        }
    });

    test('renders item and attendee management controls for superusers', async () => {
        renderRaidEdit();

        await waitFor(() => expect(screen.queryByText('LOADING...')).not.toBeInTheDocument());

        const attendance = RAID_ATTENDANCE_LIST.filter(record => record.raid.id === RAID_1_ID);
        expect(screen.getByText('Attendees').parentElement).toHaveTextContent(String(attendance.length));
        expect(screen.getByText('Add Item')).toBeInTheDocument();
        expect(screen.getByText('Add Attendee')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'ADD ITEM' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'ADD PLAYER' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'REMOVE SELECTED' })).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getAllByRole('checkbox')).toHaveLength(
                attendance.length + ITEM_AWARDED_LIST.filter(award => award.raid.id === RAID_1_ID).length
            );
        });
    });
});
