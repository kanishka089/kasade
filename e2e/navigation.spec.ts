import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('redirects unauthenticated users from protected routes', async ({ page }) => {
    await page.goto('/search');
    // Should redirect to login or show auth prompt
    await page.waitForURL(/\/(login|$)/);
    expect(page.url()).toMatch(/\/(login|$)/);
  });

  test('redirects unauthenticated users from profile', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForURL(/\/(login|$)/);
    expect(page.url()).toMatch(/\/(login|$)/);
  });

  test('home page is accessible without auth', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    // Should stay on home page
    expect(page.url()).toMatch(/\/$/);
  });

  test('footer is visible on public pages', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).toBeVisible();
  });
});
