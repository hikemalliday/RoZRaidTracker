import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ENVIRONMENT } from './src/config.js';
// https://vite.dev/config/

let config = {
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.js',
    },
};
if (ENVIRONMENT === 'prod') config.base = '/static/';
export default defineConfig(config);
