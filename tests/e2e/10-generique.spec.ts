import { expect, test, type Page } from '@playwright/test';
import { ajouterJoueurs, verifierAxe } from './outils';

/** Règle une molette au clavier : un appui sur la flèche haut par unité, chiffre par chiffre. */
async function regler(page: Page, groupe: string, valeur: number) {
  const g = page.getByRole('group', { name: groupe });
  if (valeur < 0)
    await g.getByRole('spinbutton', { name: 'Signe' }).press('ArrowUp');
  const chiffres = String(Math.abs(valeur)).split('').reverse();
  const noms = ['Unités', 'Dizaines', 'Centaines'];
  for (const [i, c] of chiffres.entries())
    for (let n = 0; n < Number(c); n++)
      await g
        .getByRole('spinbutton', { name: noms[i], exact: true })
        .press('ArrowUp');
}

async function ajouterManche(page: Page, valeurs: Record<string, number>) {
  await page.getByRole('button', { name: 'Ajouter une manche' }).click();
  for (const [nom, v] of Object.entries(valeurs)) {
    const replie = page.getByRole('button', {
      name: new RegExp(`^Régler le score de ${nom}`)
    });
    if (await replie.count()) await replie.click();
    await regler(page, `Score de ${nom}`, v);
  }
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Ajouter', exact: true })
    .click();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/scores');
});

test('SCO-01 : sans joueur, invitation à en ajouter et aucune saisie proposée', async ({
  page
}) => {
  await expect(
    page.getByRole('heading', { name: 'Aucun joueur pour l’instant' })
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Ajouter une manche' })
  ).toHaveCount(0);
  await expect(page.getByRole('tablist')).toHaveCount(0);
  await page.getByRole('button', { name: 'Ajouter des joueurs' }).click();
  await expect(page.getByRole('dialog', { name: 'Joueurs' })).toBeVisible();
});

test.describe('avec trois joueurs', () => {
  test.beforeEach(async ({ page }) => {
    await ajouterJoueurs(page, ['Alice', 'Bruno', 'Chloé']);
  });

  test('SCO-02 : une ligne par joueur à 0, molettes au clavier, Ajouter rend le focus', async ({
    page
  }) => {
    const bouton = page.getByRole('button', { name: 'Ajouter une manche' });
    await bouton.click();
    const feuille = page.getByRole('dialog', { name: 'Ajouter une manche' });
    await expect(feuille.getByText('Manche 1')).toBeVisible();
    await expect(
      feuille.getByRole('group', { name: 'Score de Alice' })
    ).toBeVisible();
    await expect(
      feuille.getByRole('button', { name: /^Régler le score de/ })
    ).toHaveText([/Bruno\s*0/, /Chloé\s*0/]);
    await verifierAxe(page);
    await regler(page, 'Score de Alice', -12);
    await expect(
      feuille
        .getByRole('group', { name: 'Score de Alice' })
        .getByRole('spinbutton', { name: 'Signe' })
    ).toHaveAttribute('aria-valuetext', 'moins');
    await feuille.getByRole('button', { name: 'Ajouter', exact: true }).click();
    await expect(feuille).toBeHidden();
    await expect(bouton).toBeFocused();
    await expect(page.getByRole('row').nth(1)).toHaveText(/^1\s*−12.*0.*0/);
  });

  test('SCO-02 : Annuler ou Échap ferme sans rien changer', async ({
    page
  }) => {
    await page.getByRole('button', { name: 'Ajouter une manche' }).click();
    await regler(page, 'Score de Alice', 3);
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Ajouter une manche' }).click();
    await page.getByRole('button', { name: 'Annuler' }).click();
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(page.getByRole('row')).toHaveCount(2);
  });

  test('SCO-02 / MOD-06 : la saisie en cours survit au rechargement', async ({
    page
  }) => {
    await page.getByRole('button', { name: 'Ajouter une manche' }).click();
    await regler(page, 'Score de Alice', 7);
    await page.reload();
    const feuille = page.getByRole('dialog', { name: 'Ajouter une manche' });
    await expect(
      feuille
        .getByRole('group', { name: 'Score de Alice' })
        .getByRole('spinbutton', { name: 'Unités' })
    ).toHaveAttribute('aria-valuenow', '7');
  });

  test('SCO-03 : totaux et meilleurs scores', async ({ page }) => {
    await ajouterManche(page, { Alice: 10, Bruno: 5, Chloé: 5 });
    await ajouterManche(page, { Alice: -3, Bruno: 4, Chloé: 4 });
    await expect(page.locator('tfoot')).toHaveText(/Total\s*7\s*9\s*9/);
    await expect(
      page.locator('tbody tr').nth(0).getByText('(meilleur score)')
    ).toHaveCount(1);
    await expect(
      page.locator('tbody tr').nth(1).getByText('(meilleur score)')
    ).toHaveCount(2);
  });

  test('SCO-04 : modifier une case, toast Annuler, pas de « Retirer la dernière saisie »', async ({
    page
  }) => {
    await ajouterManche(page, { Alice: 10, Bruno: 5, Chloé: 5 });
    await ajouterManche(page, { Alice: 1, Bruno: 4, Chloé: 2 });
    await expect(
      page.getByText(
        'Touchez une case pour la modifier, un nom pour gérer les joueurs.'
      )
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Retirer la dernière/ })
    ).toHaveCount(0);
    await page
      .getByRole('button', { name: /^Modifier le score de Bruno, manche 2/ })
      .click();
    const feuille = page.getByRole('dialog', { name: 'Modifier un score' });
    await expect(feuille.getByText('Avant : 4')).toBeVisible();
    await verifierAxe(page);
    await regler(page, 'Score de Bruno, manche 2', 2);
    await feuille.getByRole('button', { name: 'Enregistrer' }).click();
    await expect(page.locator('tfoot')).toHaveText(/Total\s*11\s*11\s*7/);
    const toast = page
      .getByRole('status')
      .filter({ hasText: 'Score de Bruno modifié' });
    await expect(toast).toContainText('Manche 2 : 4 devient 6');
    await toast.getByRole('button', { name: 'Annuler' }).click();
    await expect(page.locator('tfoot')).toHaveText(/Total\s*11\s*9\s*7/);
  });

  test('SCO-05 : menu Joueurs et Nouvelle partie, appui sur un nom', async ({
    page
  }) => {
    await ajouterManche(page, { Alice: 1 });
    await page.getByRole('button', { name: 'Menu du jeu' }).click();
    await expect(page.getByRole('button', { name: /^Joueurs/ })).toBeVisible();
    await page.getByRole('button', { name: /^Nouvelle partie/ }).click();
    await expect(page.getByRole('row')).toHaveCount(2);
    await page
      .getByRole('columnheader', { name: 'Chloé' })
      .getByRole('button')
      .click();
    await expect(page.getByRole('dialog', { name: 'Joueurs' })).toBeVisible();
  });

  test('[A] tableau en cours, clair et sombre', async ({ page }) => {
    await ajouterManche(page, { Alice: 10, Bruno: 5 });
    await verifierAxe(page);
  });
});

test('SCO-06 : 20 joueurs, sans maximum, défilement dans le tableau, couleurs qui recommencent', async ({
  page
}) => {
  const noms = Array.from({ length: 20 }, (_, i) => `Joueur ${i + 1}`);
  await ajouterJoueurs(page, noms);
  await expect(page.getByRole('columnheader')).toHaveCount(21);
  const pastille = (n: number) =>
    page
      .getByRole('columnheader', { name: `Joueur ${n}`, exact: true })
      .locator('.sb-dot');
  await expect(pastille(13)).toHaveAttribute('style', /--player-1\)/);
  await expect(pastille(12)).toHaveAttribute('style', /--player-12\)/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true);
  const conteneur = page.locator('.sb-table-wrap');
  await conteneur.evaluate((e) => (e.scrollLeft = e.scrollWidth));
  await expect(
    page.getByRole('columnheader', { name: 'Manche' })
  ).toBeInViewport();
  await verifierAxe(page);
});
