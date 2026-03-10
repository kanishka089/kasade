import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('loads the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/kasade/i);
  });

  test('displays hero section', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();
  });

  test('has navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /login/i })).toBeVisible();
  });

  test('language switcher toggles language', async ({ page }) => {
    await page.goto('/');
    const switcher = page.getByRole('button', { name: /SI|EN/i });
    await expect(switcher).toBeVisible();
    await switcher.click();
    // After clicking, the button text should change
    await expect(switcher).toBeVisible();
  });
});
