import { describe, test, expect } from 'vitest';
import { renderRouteWithContext } from '../../testUtils.jsx';
import { screen, waitFor } from '@testing-library/react';
import { RaidDetailView } from '../RaidDetailView.jsx';
import { RAID_1_ID, ITEM_AWARDED_LIST, RAID_ATTENDANCE_LIST } from '../../mocks/mockData.js';

describe('RaidDetailView', () => {
    test('renders loading state initially', () => {
        renderRouteWithContext(true, {
            route: [`/raids/${RAID_1_ID}`],
            path: '/raids/:id',
            element: <RaidDetailView />,
        });

        expect(screen.getByText('LOADING...')).toBeInTheDocument();
    });

    test('renders raid details after loading', async () => {
        renderRouteWithContext(true, {
            route: [`/raids/${RAID_1_ID}`],
            path: '/raids/:id',
            element: <RaidDetailView />,
        });

        await waitFor(() => {
            expect(screen.queryByText('LOADING...')).not.toBeInTheDocument();
        });

        expect(screen.getAllByText('Test Raid 1').length).toBeGreaterThan(0); // Could assert actual len's here
        expect(screen.getAllByText('2025-01-15').length).toBeGreaterThan(0);
    });

    test('renders items awarded for the raid', async () => {
        renderRouteWithContext(true, {
            route: [`/raids/${RAID_1_ID}`],
            path: '/raids/:id',
            element: <RaidDetailView />,
        });

        await waitFor(() => {
            expect(screen.queryByText('LOADING...')).not.toBeInTheDocument();
        });

        const raid1Items = ITEM_AWARDED_LIST.filter(item => item.raid.id === RAID_1_ID);

        raid1Items.forEach(item => {
            expect(screen.getByText(item.item.name)).toBeInTheDocument();
        });
    });

    test('renders attendees for the raid', async () => {
        renderRouteWithContext(true, {
            route: [`/raids/${RAID_1_ID}`],
            path: '/raids/:id',
            element: <RaidDetailView />,
        });

        await waitFor(() => {
            expect(screen.queryByText('LOADING...')).not.toBeInTheDocument();
        });

        const raid1Attendees = RAID_ATTENDANCE_LIST.filter(ra => ra.raid.id === RAID_1_ID);

        expect(screen.getByText(`Attendees - Total: ${raid1Attendees.length}`)).toBeInTheDocument();
    });
});
