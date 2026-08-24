import { describe, expect, test } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { renderComponentWithContext } from '../../testUtils.jsx';
import { server } from '../../tests/mocks/node.js';
import Login from '../Login.jsx';

const renderLogin = () => renderComponentWithContext(<Login />);

describe('Login', () => {
    test('renders username, password, and submit controls', () => {
        renderLogin();

        expect(screen.getByRole('heading', { name: 'LOG IN' })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Username')).toBeRequired();
        expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password');
        expect(screen.getByRole('button', { name: 'SUBMIT' })).toBeInTheDocument();
    });

    test('stores tokens after a successful login', async () => {
        renderLogin();

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: '  Grixus ' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'secret' } });
        fireEvent.click(screen.getByRole('button', { name: 'SUBMIT' }));

        await waitFor(() => expect(localStorage.getItem('accessToken')).toBeTruthy());
        expect(localStorage.getItem('refreshToken')).toBe('mock-refresh-token');
        expect(screen.getByText(/Login successful/)).toBeInTheDocument();
    });

    test('renders the API credential error when login fails', async () => {
        server.use(
            http.post('*/token/', () => HttpResponse.json({ detail: 'Invalid username or password.' }, { status: 401 }))
        );
        renderLogin();

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'Grixus' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrong' } });
        fireEvent.click(screen.getByRole('button', { name: 'SUBMIT' }));

        expect(await screen.findByText('Invalid username or password.')).toBeInTheDocument();
    });
});
