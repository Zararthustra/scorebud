import { expect, test } from '@playwright/test';
import { ajouterJoueurs, ajouterPoints, verifierAxe } from './outils';

// Le module factice n'existe que dans le build de test (--mode e2e) : MOD-01.
test.beforeEach(async ({ page }) => {
  await page.goto('/factice');
});

const ouvrirJoueurs = async (page: import('@playwright/test').Page) => {
  await page.getByRole('button', { name: 'Menu du jeu' }).click();
  await page.getByRole('button', { name: /^Joueurs/ }).click();
};

test.describe('MOD-01, MOD-09 : structure commune', () => {
  test('le module factice apparaît dans le catalogue', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Jeu factice/ }).click();
    await expect(page).toHaveURL('/factice');
    await expect(page).toHaveTitle('Scorebud · Jeu factice');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Jeu factice' })
    ).toBeVisible();
  });

  test('onglets de saisie puis Score et Règles, pilotables au clavier', async ({
    page
  }) => {
    const onglets = page.getByRole('tab');
    await expect(onglets).toHaveText(['Saisie', 'Score', 'Règles']);
    await onglets.first().focus();
    await page.keyboard.press('ArrowRight');
    const score = page.getByRole('tab', { name: 'Score' });
    await expect(score).toHaveAttribute('aria-selected', 'true');
    await expect(score).toHaveAttribute('aria-current', 'page');
    await page.keyboard.press('End');
    await expect(page.getByRole('tab', { name: 'Règles' })).toBeFocused();
    await page.keyboard.press('Home');
    await expect(page.getByRole('tab', { name: 'Saisie' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  test('l’onglet ouvert est conservé au rechargement', async ({ page }) => {
    await page.getByRole('tab', { name: 'Règles' }).click();
    await page.reload();
    await expect(page.getByRole('tab', { name: 'Règles' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  test('Règles : barème du module et liens dans un nouvel onglet', async ({
    page
  }) => {
    await page.getByRole('tab', { name: 'Règles' }).click();
    await expect(
      page.getByText('Règle factice : chaque appui ajoute les points saisis.')
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /Règle officielle factice/ })
    ).toHaveAttribute('target', '_blank');
  });
});

test.describe('MOD-02 : préparer une partie', () => {
  test('Entrée ajoute, le champ est vidé et garde le focus', async ({
    page
  }) => {
    await ouvrirJoueurs(page);
    const champ = page.getByLabel('Nom');
    await champ.fill('  alice ');
    await champ.press('Enter');
    await expect(
      page.getByRole('dialog').getByText('Alice', { exact: true })
    ).toBeVisible();
    await expect(champ).toHaveValue('');
    await expect(champ).toBeFocused();
  });

  test('messages : vide, doublon, minimum, maximum ; 15 caractères au plus', async ({
    page
  }) => {
    await ouvrirJoueurs(page);
    const feuille = page.getByRole('dialog');
    const champ = page.getByLabel('Nom');
    await page.getByRole('button', { name: 'Ajouter', exact: true }).click();
    await expect(feuille.getByText('Entrez un nom.')).toBeVisible();
    await expect(champ).toHaveAttribute('maxlength', '15');
    await champ.fill('Alice');
    await expect(feuille.getByText('Entrez un nom.')).toBeHidden();
    await champ.press('Enter');
    await expect(feuille.getByText('Ajoutez encore 1 joueur')).toBeVisible();
    await champ.fill('ALICE');
    await champ.press('Enter');
    await expect(
      feuille.getByText('Ce nom est déjà pris. Choisissez-en un autre.')
    ).toBeVisible();
    await champ.fill('Bruno');
    await champ.press('Enter');
    await expect(feuille.getByText(/Ajoutez encore/)).toBeHidden();
    await champ.fill('Chloé');
    await champ.press('Enter');
    await expect(feuille.getByText('Maximum atteint')).toBeVisible();
    await expect(page.getByLabel('Nom')).toBeHidden();
  });

  test('sous le minimum, l’onglet Score invite à ajouter des joueurs', async ({
    page
  }) => {
    await page.getByRole('tab', { name: 'Score' }).click();
    await expect(
      page.getByRole('heading', { name: 'Aucun joueur pour l’instant' })
    ).toBeVisible();
    await page.getByRole('button', { name: 'Ajouter des joueurs' }).click();
    await expect(page.getByRole('dialog', { name: 'Joueurs' })).toBeVisible();
  });

  test('retirer un participant, puis Annuler le rend', async ({ page }) => {
    await ajouterJoueurs(page, ['Alice', 'Bruno']);
    await ouvrirJoueurs(page);
    await page.getByRole('button', { name: 'Retirer Alice' }).click();
    await expect(
      page.getByRole('dialog').getByText('Alice', { exact: true })
    ).toBeHidden();
    await page.getByRole('button', { name: 'Terminé' }).click();
    await page
      .getByRole('status')
      .getByRole('button', { name: 'Annuler' })
      .click();
    await page.getByRole('tab', { name: 'Score' }).click();
    await expect(
      page.getByRole('columnheader', { name: 'Alice' })
    ).toBeVisible();
  });

  test('Échap ferme sans rien supprimer ; le focus revient au déclencheur', async ({
    page
  }) => {
    await ajouterJoueurs(page, ['Alice', 'Bruno']);
    const menu = page.getByRole('button', { name: 'Menu du jeu' });
    await ouvrirJoueurs(page);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(menu).toBeFocused();
    await page.getByRole('tab', { name: 'Score' }).click();
    await expect(page.getByRole('columnheader')).toHaveText([
      'Manche',
      'Alice',
      'Bruno'
    ]);
  });

  test('après la première saisie, les participants sont verrouillés', async ({
    page
  }) => {
    await ajouterJoueurs(page, ['Alice', 'Bruno']);
    await ajouterPoints(page, 'Alice', 10);
    await ouvrirJoueurs(page);
    await expect(
      page.getByText('Pour changer les joueurs, lancez une nouvelle partie')
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /^Retirer/ })).toHaveCount(0);
    await expect(page.getByLabel('Nom')).toBeHidden();
  });

  test('[A] feuille Joueurs', async ({ page }) => {
    await ajouterJoueurs(page, ['Alice']);
    await ouvrirJoueurs(page);
    await verifierAxe(page);
  });
});

test.describe('onglet Score, MOD-04, MOD-05, MOD-07, GEN-09', () => {
  test.beforeEach(async ({ page }) => {
    await ajouterJoueurs(page, ['Alice', 'Bruno']);
  });

  test('toast « Voir le score » et tableau ; appui sur un nom ouvre les joueurs', async ({
    page
  }) => {
    await ajouterPoints(page, 'Alice', 10, false);
    await page
      .getByRole('status')
      .getByRole('button', { name: 'Voir le score' })
      .click();
    await expect(page.getByRole('tab', { name: 'Score' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    await expect(page.getByRole('row').nth(1)).toHaveText(
      /^1\s*10\s*–\s*pas de score$/
    );
    await page
      .getByRole('columnheader', { name: 'Bruno' })
      .getByRole('button')
      .click();
    await expect(page.getByRole('dialog', { name: 'Joueurs' })).toBeVisible();
  });

  test('MOD-04 / GEN-09 : retirer la dernière saisie, Annuler la rend, après 5 s c’est définitif', async ({
    page
  }) => {
    await page.clock.install();
    await ajouterPoints(page, 'Alice', 10);
    await ajouterPoints(page, 'Bruno', 5);
    await page.getByRole('tab', { name: 'Score' }).click();
    const cinq = page
      .locator('tbody')
      .getByRole('cell', { name: '5', exact: true });
    await page
      .getByRole('button', { name: 'Retirer la dernière saisie' })
      .click();
    await expect(cinq).toHaveCount(0);
    await page
      .getByRole('status')
      .filter({ hasText: 'Dernière saisie retirée' })
      .getByRole('button', { name: 'Annuler' })
      .click();
    await expect(cinq).toBeVisible();
    await page
      .getByRole('button', { name: 'Retirer la dernière saisie' })
      .click();
    await page.clock.runFor(5000);
    await expect(page.getByRole('button', { name: 'Annuler' })).toHaveCount(0);
    await expect(cinq).toHaveCount(0);
  });

  test('MOD-05 : nouvelle partie sans rechargement, garde les joueurs, Annuler restaure tout', async ({
    page
  }) => {
    await ajouterPoints(page, 'Alice', 10);
    await page.getByLabel('Points').fill('7');
    await page.evaluate(
      () =>
        ((window as unknown as { sansRechargement: boolean }).sansRechargement =
          true)
    );
    await page.getByRole('button', { name: 'Menu du jeu' }).click();
    await page.getByRole('button', { name: /^Nouvelle partie/ }).click();
    await expect(page.getByLabel('Points')).toHaveValue('');
    await expect(page.getByRole('button', { name: /^Ajouter à/ })).toHaveText([
      'Ajouter à Alice',
      'Ajouter à Bruno'
    ]);
    await page
      .getByRole('status')
      .getByRole('button', { name: 'Annuler' })
      .click();
    await expect(page.getByLabel('Points')).toHaveValue('7');
    await page.getByRole('tab', { name: 'Score' }).click();
    await expect(page.getByRole('row').nth(1)).toHaveText(/^1\s*10/);
    expect(
      await page.evaluate(
        () =>
          (window as unknown as { sansRechargement: boolean }).sansRechargement
      )
    ).toBe(true);
  });

  test('MOD-05 : « Nouvelle partie » n’existe qu’avec au moins une saisie', async ({
    page
  }) => {
    await page.getByRole('button', { name: 'Menu du jeu' }).click();
    await expect(
      page.getByRole('button', { name: /^Nouvelle partie/ })
    ).toHaveCount(0);
  });

  test('MOD-07 : fin de partie, gagnant nommé, saisie impossible, retirer rouvre', async ({
    page
  }) => {
    await ajouterPoints(page, 'Alice', 30);
    await expect(
      page.getByRole('heading', { name: 'Alice gagne la partie' })
    ).toBeVisible();
    await expect(page.getByLabel('Points')).toHaveCount(0);
    await page.getByRole('tab', { name: 'Score' }).click();
    await page
      .getByRole('button', { name: 'Retirer la dernière saisie' })
      .first()
      .click();
    await page.getByRole('tab', { name: 'Saisie' }).click();
    await expect(page.getByLabel('Points')).toBeVisible();
  });

  test('[A] onglet Score avec fin de partie', async ({ page }) => {
    await ajouterPoints(page, 'Alice', 30);
    await page.getByRole('tab', { name: 'Score' }).click();
    await verifierAxe(page);
  });
});
