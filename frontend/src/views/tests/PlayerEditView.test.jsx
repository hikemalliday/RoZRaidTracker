import { describe, expect, test } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderRouteWithContext } from '../../testUtils.jsx';
import { PlayerEditView } from '../PlayerEditView.jsx';
import { CHARACTER_LIST, PLAYER_1_ID } from '../../tests/mocks/mockData.js';

const renderPlayerEdit = () => renderRouteWithContext(true, {
    route: [`/player/${PLAYER_1_ID}/edit`],
    path: '/player/:id/edit',
    element: <PlayerEditView />,
});

describe('PlayerEditView', () => {
    test('renders a loading state while characters are requested', () => {
        renderPlayerEdit();

        expect(screen.getByText('LOADING...')).toBeInTheDocument();
    });

    test('renders editable character rows for the selected player', async () => {
        renderPlayerEdit();

        await waitFor(() => expect(screen.queryByText('LOADING...')).not.toBeInTheDocument());

        for (const character of CHARACTER_LIST.filter(record => record.player.id === PLAYER_1_ID)) {
            expect(screen.getAllByText(character.name).length).toBeGreaterThan(0);
            expect(screen.getByText(character.char_class)).toBeInTheDocument();
            expect(screen.getAllByText(character.type === 'MAIN' ? 'Main' : 'Main Alt').length).toBeGreaterThan(0);
        }

        expect(screen.getByRole('button', { name: 'SAVE' })).toBeInTheDocument();
    });

    test('renders controls to add a character', async () => {
        renderPlayerEdit();

        await waitFor(() => expect(screen.queryByText('LOADING...')).not.toBeInTheDocument());

        expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Class' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Type' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'ADD CHARACTER' })).toBeInTheDocument();
    });
});
