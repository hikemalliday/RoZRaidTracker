import { describe, expect, test } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderRouteWithContext } from '../../testUtils.jsx';
import { PlayerDetailView } from '../PlayerDetailView.jsx';
import {
    CHARACTER_LIST,
    ITEM_AWARDED_LIST,
    PLAYER_1_ID,
    PLAYER_LIST,
    RAID_ATTENDANCE_LIST,
} from '../../tests/mocks/mockData.js';

const renderPlayerDetail = () => renderRouteWithContext(false, {
    route: [`/player/${PLAYER_1_ID}`],
    path: '/player/:id',
    element: <PlayerDetailView />,
});

describe('PlayerDetailView', () => {
    test('renders a loading state while player data is requested', () => {
        renderPlayerDetail();

        expect(screen.getByText('LOADING...')).toBeInTheDocument();
    });

    test('renders player details and their characters', async () => {
        renderPlayerDetail();

        await waitFor(() => expect(screen.queryByText('LOADING...')).not.toBeInTheDocument());

        const player = PLAYER_LIST.find(record => record.id === PLAYER_1_ID);
        expect(screen.getByText('Player', { selector: 'p' }).parentElement).toHaveTextContent(player.name);
        expect(screen.getByText('Lifetime Ra').parentElement).toHaveTextContent(String(player.lifetime_ra));
        expect(screen.getByText('21 Day Ra').parentElement).toHaveTextContent(String(player.ra_21_day));

        CHARACTER_LIST
            .filter(character => character.player.id === PLAYER_1_ID)
            .forEach(character => {
                expect(screen.getAllByText(character.name).length).toBeGreaterThan(0);
                expect(screen.getByText(character.char_class)).toBeInTheDocument();
                expect(screen.getByText(character.type)).toBeInTheDocument();
            });
    });

    test('renders only items awarded to the player', async () => {
        renderPlayerDetail();

        await waitFor(() => expect(screen.queryByText('LOADING...')).not.toBeInTheDocument());

        const playerItems = ITEM_AWARDED_LIST.filter(award => award.player.id === PLAYER_1_ID);
        expect(screen.getByText(`Total Items Shown: ${playerItems.length}`)).toBeInTheDocument();
        playerItems.forEach(award => expect(screen.getByText(award.item.name)).toBeInTheDocument());
    });

    test('renders the player raid-attendance total', async () => {
        renderPlayerDetail();

        await waitFor(() => expect(screen.queryByText('LOADING...')).not.toBeInTheDocument());

        const attendance = RAID_ATTENDANCE_LIST.filter(record => record.player.id === PLAYER_1_ID);
        expect(screen.getByText(`Raids Attended: ${attendance.length}`)).toBeInTheDocument();
    });
});
