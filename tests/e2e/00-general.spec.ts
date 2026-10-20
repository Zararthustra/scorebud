import { expect, test } from '@playwright/test';

test("l'application démarre", async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.getByRole('heading', { name: 'ScoreBud' })).toBeVisible();
});
