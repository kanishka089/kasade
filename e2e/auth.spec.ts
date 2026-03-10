import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('login page renders', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: /login|sign in/i })).toBeVisible();
  });

  test('login form shows validation errors', async ({ page }) => {
    await page.goto('/login');
    // Click submit without filling fields
    await page.getByRole('button', { name: /login|sign in/i }).click();
    // Should show validation errors
    await expect(page.locator('text=/required|email|password/i').first()).toBeVisible();
  });

  test('register page renders with step 1', async ({ page }) => {
    await page.goto('/register');
    // Step 1 should be visible
    await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible();
  });

  test('login page has link to register', async ({ page }) => {
    await page.goto('/login');
    const registerLink = page.getByRole('link', { name: /register|sign up|create/i });
    await expect(registerLink).toBeVisible();
  });
});
