import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { ajouterJoueurs, ajouterPoints, verifierAxe } from './outils';

test("l'application démarre", async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page).toHaveTitle('Scorebud · Jeux');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Jeux' })
  ).toBeVisible();
});

test.describe('catalogue', () => {
  test('carte du tableau libre en tête, puis les jeux, générés depuis les modules', async ({
    page
  }) => {
    await page.goto('/');
    const liens = page.getByRole('main').getByRole('link');
    await expect(liens.first()).toHaveAccessibleName(
      /^Tableau de scores libre/
    );
    await expect(page.getByRole('list').getByRole('link')).toHaveText([
      /^Belote Contrée/,
      /^Living Forest/,
      /^Jeu factice/
    ]);
    await liens.first().click();
    await expect(page).toHaveURL('/scores');
  });

  test('« Partie en cours » et jeux récents en premier', async ({ page }) => {
    await page.goto('/factice');
    await ajouterJoueurs(page, ['Alice']);
    await page.getByRole('link', { name: 'Retour au catalogue' }).click();
    const jeux = page.getByRole('list').getByRole('link');
    await expect(jeux.first()).toHaveText(/^Jeu factice.*Partie en cours/);
    await page.goto('/living-forest');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Living Forest' })
    ).toBeVisible();
    await page.goto('/');
    await expect(jeux).toHaveText([
      /^Living Forest/,
      /^Jeu factice/,
      /^Belote Contrée/
    ]);
  });

  test('[A] catalogue', async ({ page }) => {
    await page.goto('/');
    await verifierAxe(page);
  });
});

test.describe('GEN-08, R26 : adresses', () => {
  test('route inconnue : page introuvable avec retour au catalogue', async ({
    page
  }) => {
    await page.goto('/nimportequoi');
    await expect(page).toHaveTitle('Scorebud · Page introuvable');
    await expect(
      page.getByRole('heading', { name: 'Page introuvable' })
    ).toBeVisible();
    await verifierAxe(page);
    await page.getByRole('link', { name: 'Retour au catalogue' }).click();
    await expect(page).toHaveURL('/');
  });

  for (const ancienne of ['/dice', '/regles']) {
    test(`${ancienne} redirige vers l'accueil`, async ({ page }) => {
      await page.goto(ancienne);
      await expect(page).toHaveURL('/');
    });
  }
});

test('GEN-01 : changer de jeu ne perd rien', async ({ page }) => {
  await page.goto('/factice');
  await ajouterJoueurs(page, ['Alice', 'Bruno']);
  await page.getByRole('link', { name: 'Retour au catalogue' }).click();
  await page.getByRole('link', { name: /^Tableau de scores libre/ }).click();
  await page.goBack();
  await page.getByRole('link', { name: /^Jeu factice/ }).click();
  await page.getByRole('tab', { name: 'Score' }).click();
  await expect(page.getByRole('columnheader')).toHaveText([
    'Tour',
    'Alice',
    'Bruno'
  ]);
});

test.describe('GEN-02, GEN-03, GEN-10 : stockage', () => {
  test('GEN-02 : après rechargement, participants, saisies et saisie en cours identiques', async ({
    page
  }) => {
    await page.goto('/factice');
    await ajouterJoueurs(page, ['Alice', 'Bruno']);
    await ajouterPoints(page, 'Alice', 12);
    await page.getByLabel('Points').fill('4');
    await page.reload();
    await expect(page.getByLabel('Points')).toHaveValue('4');
    await page.getByRole('tab', { name: 'Score' }).click();
    await expect(page.getByRole('row').nth(1)).toHaveText(/^1\s*12/);
  });

  test('GEN-03 : stockage plein, bandeau et application utilisable', async ({
    page
  }) => {
    await page.addInitScript(() => {
      Storage.prototype.setItem = () => {
        throw new DOMException('plein', 'QuotaExceededError');
      };
    });
    await page.goto('/factice');
    await ajouterJoueurs(page, ['Alice', 'Bruno']);
    await expect(
      page.getByText('Cette partie n’est pas enregistrée sur cet appareil')
    ).toBeVisible();
    await page.getByRole('tab', { name: 'Score' }).click();
    await expect(page.getByRole('columnheader')).toHaveText([
      'Tour',
      'Alice',
      'Bruno'
    ]);
  });

  test('GEN-03 : valeur corrompue, message une fois, les autres jeux intacts', async ({
    page
  }) => {
    await page.addInitScript(() => {
      if (sessionStorage.getItem('prepare')) return;
      sessionStorage.setItem('prepare', '1');
      localStorage.setItem('scorebud:v2:factice', '{illisible');
      localStorage.setItem(
        'scorebud:v2:generique',
        JSON.stringify({
          schemaVersion: 1,
          participants: [
            { id: 'a', nom: 'Alice' },
            { id: 'b', nom: 'Bruno' }
          ],
          saisies: [],
          brouillon: { valeurs: null }
        })
      );
    });
    await page.goto('/factice');
    await expect(page.getByRole('alert')).toHaveText(
      /La partie enregistrée n’a pas pu être relue\./
    );
    await expect(page.getByRole('alert')).toHaveCount(1);
    await page
      .getByRole('alert')
      .getByRole('button', { name: 'Fermer' })
      .click();
    await page.getByRole('tab', { name: 'Score' }).click();
    await expect(
      page.getByRole('heading', { name: 'Aucun joueur pour l’instant' })
    ).toBeVisible();
    await page.goto('/scores');
    await expect(page.getByRole('columnheader')).toHaveText([
      'Manche',
      'Alice',
      'Bruno'
    ]);
  });

  test('GEN-10 : anciennes clés supprimées sans erreur', async ({ page }) => {
    const erreurs: string[] = [];
    page.on('pageerror', (e) => erreurs.push(e.message));
    await page.addInitScript(() => {
      if (sessionStorage.getItem('prepare')) return;
      sessionStorage.setItem('prepare', '1');
      for (const k of ['players', 'contree', 'calculate'])
        localStorage.setItem(k, '[{"name":"ancien"}]');
    });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Jeux' })).toBeVisible();
    expect(
      await page.evaluate(() =>
        ['players', 'contree', 'calculate'].map((k) => localStorage.getItem(k))
      )
    ).toEqual([null, null, null]);
    expect(erreurs).toEqual([]);
  });
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

test.describe('Réglages : GEN-06, GEN-07, GEN-11', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await page.getByRole('button', { name: 'Réglages' }).click();
  });

  test('GEN-06 : le choix manuel s’applique et est mémorisé après rechargement', async ({
    page
  }) => {
    await page.getByRole('radio', { name: 'Sombre' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.getByRole('button', { name: 'Réglages' }).click();
    await expect(page.getByRole('radio', { name: 'Sombre' })).toHaveAttribute(
      'aria-checked',
      'true'
    );
  });

  test('GEN-11 : la version de package.json est affichée', async ({ page }) => {
    const { version } = JSON.parse(readFileSync('package.json', 'utf8'));
    await expect(page.getByRole('dialog', { name: 'Réglages' })).toContainText(
      `version ${version}`
    );
  });

  test('GEN-07 : « Garder mes données » ne change rien, « Effacer » ne supprime que les clés scorebud:', async ({
    page
  }) => {
    await page.evaluate(() => localStorage.setItem('autre-site', 'garde'));
    await page.getByRole('radio', { name: 'Sombre' }).click();
    await page
      .getByRole('button', { name: 'Effacer toutes les données' })
      .click();
    const garder = page.getByRole('button', { name: 'Garder mes données' });
    await expect(garder).toBeFocused();
    await verifierAxe(page);
    await page.emulateMedia({ colorScheme: 'light' });
    await garder.click();
    expect(
      await page.evaluate(() => localStorage.getItem('scorebud:v2:prefs'))
    ).not.toBeNull();
    await page
      .getByRole('button', { name: 'Effacer toutes les données' })
      .click();
    await page.getByRole('button', { name: 'Effacer les données' }).click();
    expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([
      'autre-site'
    ]);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.getByRole('heading', { name: 'Jeux' })).toBeVisible();
  });

  test('[A] Réglages', async ({ page }) => {
    await verifierAxe(page);
  });
});
