import { expect, test } from '@playwright/test';
import { ajouterJoueurs } from './outils';

// Seul fichier où le service worker est actif (bloqué ailleurs, playwright.config.ts).
test.use({ serviceWorkers: 'allow' });

test('GEN-04 : après une première visite, la page se recharge hors ligne et un score peut être ajouté', async ({
  page,
  context
}) => {
  await page.goto('/scores');
  await expect(
    page
      .getByRole('status')
      .filter({ hasText: 'Prêt pour une utilisation hors ligne' })
  ).toBeVisible();
  await page.reload();
  await expect
    .poll(() => page.evaluate(() => !!navigator.serviceWorker.controller))
    .toBe(true);

  await context.setOffline(true);
  await page.reload();
  await ajouterJoueurs(page, ['Alice', 'Bruno']);
  await page.getByRole('button', { name: 'Ajouter une manche' }).click();
  await page
    .getByRole('group', { name: 'Score de Alice' })
    .getByRole('spinbutton', { name: 'Unités' })
    .press('ArrowUp');
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Ajouter', exact: true })
    .click();
  await expect(page.locator('tfoot')).toHaveText(/Total\s*1\s*0/);

  await page.goto('/belote-contree');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Belote Contrée' })
  ).toBeVisible();
});
