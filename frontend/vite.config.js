import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [react()],
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: './src/setupTests.js',
        },
        base: env.VITE_CONFIG_BASE || '/static/',
        build: {
            sourcemap: env.VITE_SOURCEMAP,
            minify: 'esbuild',
        }
    }
});
