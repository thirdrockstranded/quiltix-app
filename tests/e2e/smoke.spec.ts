import { test, expect } from '@playwright/test';

test('frontend loads without error', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
});

test('backend health check is reachable', async ({ request }) => {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
  const response = await request.get(`${backendUrl}/health`);
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ status: 'ok' });
});
