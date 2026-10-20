import { expect, test, type Page } from '@playwright/test';
import { ajouterJoueurs, verifierAxe } from './outils';

// T23 : écrans des maquettes que les autres fichiers ne passent pas déjà à axe, puis largeurs extrêmes.

test('[A] compteur libre sans joueur, menu du jeu', async ({ page }) => {
  await page.goto('/scores');
  await verifierAxe(page);
  await page.getByRole('button', { name: 'Menu du jeu' }).click();
  await verifierAxe(page);
});

test('[A] onglet Score de la Contrée avec une donne et toast', async ({
  page
}) => {
  await page.goto('/belote-contree');
  await ajouterJoueurs(page, ['Nous', 'Eux']);
  const g = (n: string) => page.getByRole('radiogroup', { name: n });
  await g('Équipe preneuse').getByRole('radio', { name: 'Nous' }).click();
  await g('Atout').getByRole('radio', { name: 'Pique' }).click();
  await page.getByLabel('Contrat').selectOption('Capot');
  await page.getByRole('button', { name: 'Compter Nous' }).click();
  await page.getByRole('button', { name: 'Voir le résultat' }).click();
  await page.getByRole('button', { name: 'Comptabiliser la manche' }).click();
  await verifierAxe(page);
  await page.getByRole('tab', { name: 'Score' }).click();
  await verifierAxe(page);
});

test('[A] onglet Score de Living Forest', async ({ page }) => {
  await page.goto('/living-forest');
  await ajouterJoueurs(page, ['Alice', 'Bruno']);
  const points = page.getByRole('region', { name: 'Points du joueur' });
  await points
    .getByRole('button', { name: 'Ajouter un feu', exact: true })
    .click();
  await points.getByRole('button', { name: /^Ajouter 1 pour/ }).click();
  await page.getByRole('tab', { name: 'Score' }).click();
  await verifierAxe(page);
});

async function sansDefilementHorizontal(page: Page) {
  const debord = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  );
  expect(debord, page.url()).toBeLessThanOrEqual(0);
}

for (const [nom, taille] of [
  [
    '320 px de large (redistribution, WCAG 1.4.10)',
    { width: 320, height: 640 }
  ],
  ['paysage', { width: 844, height: 390 }]
] as const) {
  test(`${nom} : aucun défilement horizontal de la page`, async ({ page }) => {
    await page.setViewportSize(taille);
    await page.goto('/');
    await sansDefilementHorizontal(page);
    await page.goto('/scores');
    await ajouterJoueurs(page, ['Alice', 'Bruno', 'Chloé', 'Denis', 'Élise']);
    await sansDefilementHorizontal(page);
    await page.getByRole('button', { name: 'Ajouter une manche' }).click();
    await sansDefilementHorizontal(page);
    const molettes = await page
      .getByRole('group', { name: 'Score de Alice' })
      .boundingBox();
    expect(molettes!.x + molettes!.width).toBeLessThanOrEqual(taille.width);
    await page.keyboard.press('Escape');
    await page.goto('/belote-contree');
    await ajouterJoueurs(page, ['Nous', 'Eux']);
    await sansDefilementHorizontal(page);
    await page.goto('/living-forest');
    await sansDefilementHorizontal(page);
  });
}
