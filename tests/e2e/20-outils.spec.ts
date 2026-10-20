import { expect, test } from '@playwright/test';
import { verifierAxe } from './outils';

test.describe('OUT-01 : dé', () => {
  test('ouverture, rien avant le premier lancer, résultat annoncé, focus rendu', async ({
    page
  }) => {
    await page.addInitScript(() => (Math.random = () => 0.5));
    await page.goto('/');
    const bouton = page.getByRole('button', { name: 'Dé', exact: true });
    await bouton.click();
    const feuille = page.getByRole('dialog', { name: 'Dé' });
    await expect(feuille.getByText(/Résultat/)).toHaveCount(0);
    await expect(feuille.getByRole('img', { name: /Face/ })).toHaveCount(0);
    await feuille.getByRole('button', { name: 'Lancer le dé' }).click();
    await expect(feuille.getByText('Résultat : 4')).toBeVisible();
    await expect(feuille.getByRole('img', { name: 'Face 4' })).toBeVisible();
    await verifierAxe(page);
    await page.keyboard.press('Escape');
    await expect(feuille).toBeHidden();
    await expect(bouton).toBeFocused();
  });

  test('prefers-reduced-motion : la face s’affiche sans rotation', async ({
    page
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/scores');
    await page.getByRole('button', { name: 'Dé', exact: true }).click();
    await page.getByRole('button', { name: 'Lancer le dé' }).click();
    const duree = await page
      .getByRole('img', { name: /Face/ })
      .evaluate((e) => parseFloat(getComputedStyle(e).animationDuration));
    expect(duree).toBeLessThan(0.01);
  });
});

test.describe('OUT-03 à OUT-06 : minuteur', () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.install();
    await page.goto('/');
  });

  test('réglage par pas de 15 s, bornes, démarrage, pause', async ({
    page
  }) => {
    await page.getByRole('button', { name: 'Minuteur', exact: true }).click();
    const feuille = page.getByRole('dialog', { name: 'Minuteur' });
    const duree = feuille.locator('output');
    await expect(duree).toHaveText('0:45');
    await feuille.getByRole('button', { name: 'Ajouter 15 secondes' }).click();
    await expect(duree).toHaveText('1:00');
    for (let i = 0; i < 6; i++)
      await feuille
        .getByRole('button', { name: 'Retirer 15 secondes' })
        .click();
    await expect(duree).toHaveText('0:15');
    await feuille.getByRole('button', { name: 'Ajouter 15 secondes' }).click();
    await verifierAxe(page);

    await feuille.getByRole('button', { name: 'Démarrer le minuteur' }).click();
    await expect(
      page.getByRole('status').filter({ hasText: 'Minuteur démarré' })
    ).toHaveCount(1);
    await page.clock.runFor(5000);
    await expect(duree).toHaveText('0:25');
    await feuille.getByRole('button', { name: 'Mettre en pause' }).click();
    await page.clock.runFor(5000);
    await expect(duree).toHaveText('0:25');
    await feuille.getByRole('button', { name: 'Ajouter 15 secondes' }).click();
    await expect(duree).toHaveText('0:30');
  });

  test('OUT-03 : continue feuille fermée, affiché dans la barre, s’arrête au changement d’écran', async ({
    page
  }) => {
    await page.getByRole('button', { name: 'Minuteur', exact: true }).click();
    await page.getByRole('button', { name: 'Démarrer le minuteur' }).click();
    await page.keyboard.press('Escape');
    await page.clock.runFor(10_000);
    await expect(
      page.getByRole('button', { name: 'Minuteur, 0:35 restantes' })
    ).toHaveText('0:35');
    await page.getByRole('link', { name: /^Tableau de scores libre/ }).click();
    await expect(
      page.getByRole('button', { name: 'Minuteur', exact: true })
    ).toBeVisible();
  });

  test('OUT-04 : temps écoulé annoncé, retour à la durée choisie', async ({
    page
  }) => {
    await page.getByRole('button', { name: 'Minuteur', exact: true }).click();
    const feuille = page.getByRole('dialog', { name: 'Minuteur' });
    await feuille.getByRole('button', { name: 'Ajouter 15 secondes' }).click();
    await feuille.getByRole('button', { name: 'Démarrer le minuteur' }).click();
    await page.keyboard.press('Escape');
    await page.clock.runFor(61_000);
    await expect(
      page.getByRole('status').filter({ hasText: 'Temps écoulé' })
    ).toBeVisible();
    await page.getByRole('button', { name: 'Minuteur', exact: true }).click();
    await expect(feuille.locator('output')).toHaveText('1:00');
    await expect(
      feuille.getByRole('button', { name: 'Démarrer le minuteur' })
    ).toBeVisible();
  });

  test('OUT-05 : page suspendue 20 s, affichage juste au retour', async ({
    page
  }) => {
    await page.getByRole('button', { name: 'Minuteur', exact: true }).click();
    await page.getByRole('button', { name: 'Démarrer le minuteur' }).click();
    await page.clock.fastForward(20_000);
    await expect(
      page.getByRole('dialog', { name: 'Minuteur' }).locator('output')
    ).toHaveText('0:25');
  });
});

test('outils présents sur l’écran d’un jeu', async ({ page }) => {
  await page.goto('/living-forest');
  await expect(
    page
      .getByRole('banner')
      .getByRole('button', { name: /^(Minuteur|Dé|Menu du jeu)$/ })
  ).toHaveText(['', '', '']);
});
