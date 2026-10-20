import { expect, test } from '@playwright/test';

test("l'application démarre", async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.getByRole('heading', { name: 'ScoreBud' })).toBeVisible();
});

test.describe('GEN-06 : sans choix, le thème suit le système', () => {
  for (const [systeme, theme] of [
    ['light', 'light'],
    ['dark', 'dark']
  ] as const) {
    test(`système ${systeme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: systeme });
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    });
  }

  test('suit un changement du système sans recharger', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('préférences illisibles : suit le système', async ({ page }) => {
    await page.addInitScript(() =>
      localStorage.setItem('scorebud:v2:prefs', '{illisible')
    );
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});
