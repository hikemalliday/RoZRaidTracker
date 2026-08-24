import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './tests/mocks/node.js';

// jsdom can expose an opaque-origin window in CI, where localStorage is absent.
// The app uses storage for authentication, so make it deterministic for tests.
const storage = new Map();
const localStorageMock = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: key => storage.delete(key),
    clear: () => storage.clear(),
};
Object.defineProperty(window, 'localStorage', { configurable: true, value: localStorageMock });
Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: localStorageMock });

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
    cleanup();
    server.resetHandlers();
    window.localStorage.clear();
});
afterAll(() => server.close());
