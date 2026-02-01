import { describe, test, expect } from 'vitest';
import { renderComponentWithContext } from '../../testUtils.jsx';
import { screen, waitFor } from '@testing-library/react';
import { PlayerListView } from '../PlayerListView.jsx';
import { PLAYER_LIST } from '../../mocks/mockData.js';

describe('PlayerListView', () => {
    test('renders loading state initially', () => {
        renderComponentWithContext(<PlayerListView />);
        expect(screen.getByText('LOADING...')).toBeInTheDocument();
    });

    test('renders player list after loading', async () => {
        renderComponentWithContext(<PlayerListView />);

        await waitFor(() => {
            expect(screen.queryByText('LOADING...')).not.toBeInTheDocument();
        });

        PLAYER_LIST.forEach(player => {
            expect(screen.getByText(player.name)).toBeInTheDocument();
        });
    });

    test('renders correct number of players', async () => {
        renderComponentWithContext(<PlayerListView />);

        await waitFor(() => {
            expect(screen.queryByText('LOADING...')).not.toBeInTheDocument();
        });

        const playerNames = PLAYER_LIST.map(p => screen.getByText(p.name));
        expect(playerNames).toHaveLength(PLAYER_LIST.length);
    });
});
