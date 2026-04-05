import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.ts',
  use: {
    baseURL: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
});
