import { expect, test, type Locator, type Page } from '@playwright/test';
import { ajouterJoueurs, verifierAxe } from './outils';

const zone = (page: Page, nom: string) =>
  page.getByRole('region', { name: nom });
const valeur = (z: Locator, nom: string) =>
  z.getByRole('group', { name: nom, exact: true }).locator('output');
const appuyer = async (z: Locator, bouton: string, fois = 1) => {
  for (let i = 0; i < fois; i++)
    await z.getByRole('button', { name: bouton, exact: true }).click();
};

test.beforeEach(async ({ page }) => {
  await page.goto('/living-forest');
});

test('R16 : onglets Tour, Score, Règles ; aide-mémoire utilisable sans joueur', async ({
  page
}) => {
  await expect(
    page.getByRole('tab', { name: /^(Tour|Score|Règles)$/ })
  ).toHaveText(['Tour', 'Score', 'Règles']);
  await expect(
    page.getByText('Ajoutez 2 à 4 joueurs pour enregistrer des points')
  ).toBeVisible();
  const ressources = zone(page, 'Ressources du tour');
  await appuyer(ressources, 'Ajouter une plante');
  await expect(valeur(ressources, 'Plante')).toHaveText('1');
});

test('LF-01 : six ressources par onglet, bornées à 0, remise à zéro annulable', async ({
  page
}) => {
  const ressources = zone(page, 'Ressources du tour');
  await expect(ressources.getByRole('group')).toHaveCount(6);
  await appuyer(ressources, 'Retirer une plante');
  await expect(valeur(ressources, 'Plante')).toHaveText('0');
  await appuyer(ressources, 'Ajouter une plante', 2);
  await appuyer(ressources, 'Ajouter un kodama');
  await ressources.getByRole('tab', { name: 'Arbres' }).click();
  await expect(valeur(ressources, 'Plante')).toHaveText('0');
  await ressources.getByRole('tab', { name: 'Cartes' }).click();
  await expect(valeur(ressources, 'Plante')).toHaveText('2');

  await ressources
    .getByRole('button', { name: 'Remettre à zéro les ressources Cartes' })
    .click();
  await expect(valeur(ressources, 'Plante')).toHaveText('0');
  await expect(valeur(ressources, 'Kodama')).toHaveText('0');
  await page
    .getByRole('status')
    .getByRole('button', { name: 'Annuler' })
    .click();
  await expect(valeur(ressources, 'Plante')).toHaveText('2');

  await ressources.getByRole('tab', { name: 'Arbres' }).click();
  await ressources
    .getByRole('button', { name: 'Remettre à zéro les ressources Arbres' })
    .click();
  await expect(page.getByRole('button', { name: 'Annuler' })).toHaveCount(0);
  await verifierAxe(page);
});

test('LF-02 : totaux cartes + arbres, lotus avec ajustement, remise à zéro des conditions', async ({
  page
}) => {
  const ressources = zone(page, 'Ressources du tour');
  const victoire = zone(page, 'Conditions de victoire');
  await appuyer(ressources, 'Ajouter une plante', 2);
  await appuyer(ressources, 'Ajouter un lotus', 2);
  await ressources.getByRole('tab', { name: 'Arbres' }).click();
  await appuyer(ressources, 'Ajouter une plante');
  await appuyer(ressources, 'Ajouter un lotus');
  await expect(zone(page, 'Totaux').getByRole('definition').first()).toHaveText(
    '3'
  );
  await appuyer(victoire, 'Ajouter un lotus');
  await expect(valeur(victoire, 'Lotus')).toHaveText('4');
  await ressources.getByRole('tab', { name: 'Cartes' }).click();
  await appuyer(ressources, 'Ajouter un lotus');
  await expect(valeur(victoire, 'Lotus')).toHaveText('5');
  await appuyer(victoire, 'Retirer un lotus', 7);
  await expect(valeur(victoire, 'Lotus')).toHaveText('0');
  await appuyer(victoire, 'Ajouter un arbre', 2);
  await appuyer(victoire, 'Retirer un feu');
  await expect(valeur(victoire, 'Feux')).toHaveText('0');
  await victoire
    .getByRole('button', {
      name: 'Remettre à zéro arbres, feux et ajustement des lotus'
    })
    .click();
  await expect(valeur(victoire, 'Arbres')).toHaveText('0');
  await expect(valeur(victoire, 'Lotus')).toHaveText('4');
});

test.describe('avec deux joueurs', () => {
  test.beforeEach(async ({ page }) => {
    await ajouterJoueurs(page, ['Alice', 'Bruno']);
  });

  test('LF-03, E3, LF-05 : points par joueur, ajout au tableau, compteurs gardés', async ({
    page
  }) => {
    const points = zone(page, 'Points du joueur');
    await points.getByRole('tab', { name: 'Bruno' }).click();
    await appuyer(points, 'Ajouter un feu');
    await points.getByRole('tab', { name: 'Alice' }).click();
    await points
      .getByRole('button', { name: 'Ajouter 0 pour la manche 1' })
      .click();
    await expect(points.getByText('Aucun point à ajouter')).toBeVisible();
    await appuyer(points, 'Ajouter un arbre', 3);
    await appuyer(points, 'Ajouter un feu', 2);
    await appuyer(points, 'Ajouter un lotus');
    await page.reload();
    await expect(valeur(points, 'Arbres')).toHaveText('3');
    await points
      .getByRole('button', { name: 'Ajouter 6 pour la manche 1' })
      .click();
    await expect(valeur(points, 'Arbres')).toHaveText('0');
    await expect(valeur(points, 'Lotus')).toHaveText('0');
    await points.getByRole('tab', { name: 'Bruno' }).click();
    await expect(valeur(points, 'Feux')).toHaveText('1');
    await points.getByRole('tab', { name: 'Alice' }).click();
    await appuyer(points, 'Ajouter un arbre');
    await expect(
      points.getByRole('button', { name: 'Ajouter 1 pour la manche 2' })
    ).toBeVisible();

    const toast = page
      .getByRole('status')
      .filter({ hasText: '6 points ajoutés pour Alice' });
    await toast.getByRole('button', { name: 'Voir le score' }).click();
    await expect(page.getByRole('row').nth(1)).toHaveText(/^1\s*6\s*–/);
    await expect(
      page.getByRole('button', { name: 'Retirer le dernier ajout' })
    ).toBeVisible();
  });

  test('LF-06 : nouvelle partie remet les compteurs à 0 et garde les joueurs', async ({
    page
  }) => {
    const points = zone(page, 'Points du joueur');
    await appuyer(points, 'Ajouter un arbre', 2);
    await points
      .getByRole('button', { name: 'Ajouter 2 pour la manche 1' })
      .click();
    await appuyer(zone(page, 'Ressources du tour'), 'Ajouter un soleil');
    await page.getByRole('button', { name: 'Menu du jeu' }).click();
    await page.getByRole('button', { name: /^Nouvelle partie/ }).click();
    await expect(valeur(zone(page, 'Ressources du tour'), 'Soleil')).toHaveText(
      '0'
    );
    await expect(points.getByRole('tab')).toHaveText([/Alice/, /Bruno/]);
  });

  test('[A] onglet Tour avec joueurs', async ({ page }) => {
    await verifierAxe(page);
  });
});

test('T19 : règles du jeu et de Kodama, nouvel onglet', async ({ page }) => {
  await page.getByRole('tab', { name: 'Règles' }).click();
  const liens = page.getByRole('tabpanel').getByRole('link');
  await expect(liens).toHaveCount(2);
  await expect(liens.first()).toHaveAttribute('target', '_blank');
  await expect(page.getByRole('link', { name: /Kodama/ })).toBeVisible();
  await verifierAxe(page);
});
