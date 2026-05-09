import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// TODO: Determine local vs prod via vite `mode`. See: https://vite.dev/guide/env-and-mode
export default defineConfig(({ mode }) => {
    const isProd = mode === 'production';
    return {
        plugins: [react()],
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: './src/setupTests.js',
        },
        base: isProd ? '/static/' : '/',
    }
});
