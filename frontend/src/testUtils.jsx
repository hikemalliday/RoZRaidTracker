/* eslint-disable react-refresh/only-export-components */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { AuthProvider } from './context/AuthContext.jsx';
import { MessageProvider } from './context/MessageContext.jsx';

const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });

const Providers = ({ children, queryClient = createTestQueryClient() }) => (
    <MemoryRouter>
        <AuthProvider>
            <MessageProvider>
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </MessageProvider>
        </AuthProvider>
    </MemoryRouter>
);

export const renderComponentWithContext = (ui, options = {}) =>
    render(ui, { wrapper: ({ children }) => <Providers {...options}>{children}</Providers> });

export const renderRouteWithContext = (authenticated, { route, path, element }, options = {}) => {
    if (authenticated) {
        localStorage.setItem('accessToken', 'eyJhbGciOiJub25lIn0.eyJpc19zdXBlcnVzZXIiOnRydWV9.');
    }
    const queryClient = options.queryClient || createTestQueryClient();
    return render(
        <MemoryRouter initialEntries={route}>
            <AuthProvider>
                <MessageProvider>
                    <QueryClientProvider client={queryClient}>
                        <Routes>
                            <Route path={path} element={element} />
                        </Routes>
                    </QueryClientProvider>
                </MessageProvider>
            </AuthProvider>
        </MemoryRouter>,
    );
};
