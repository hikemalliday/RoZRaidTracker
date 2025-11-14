import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ENVIRONMENT } from './src/config.js';
// https://vite.dev/config/

let config = { plugins: [react()] };
if (ENVIRONMENT === 'prod') config.base = '/static/';
export default defineConfig(config);
