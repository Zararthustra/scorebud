import { expect, test, type Page } from '@playwright/test';
import { ajouterJoueurs, verifierAxe } from './outils';

const groupe = (page: Page, nom: string) =>
  page.getByRole('radiogroup', { name: nom });
const choisir = (page: Page, g: string, option: string) =>
  groupe(page, g).getByRole('radio', { name: option, exact: true }).click();
const interrupteur = (page: Page, nom: string) =>
  page.getByRole('switch', { name: nom, exact: true });
const carte = (page: Page, nom: string) =>
  page.getByRole('button', { name: new RegExp(`^${nom}, `) });

/** Réglage complet : Nous prend à 80, atout cœur, dix de der pour l'équipe donnée. */
async function regler(
  page: Page,
  options: { contrat?: string; dixDeDer?: string } = {}
) {
  await choisir(page, 'Équipe preneuse', 'Nous');
  await choisir(page, 'Atout', 'Cœur');
  await page.getByLabel('Contrat').selectOption(options.contrat ?? '80');
  if (options.contrat !== 'Capot')
    await choisir(page, 'Dix de der', options.dixDeDer ?? 'Eux');
}

const total = (page: Page) =>
  page.getByRole('region', { name: /^Total de/ }).locator('output');

test.beforeEach(async ({ page }) => {
  await page.goto('/belote-contree');
});

test('CON-01 : sans les deux équipes, pas de réglage de la donne', async ({
  page
}) => {
  await expect(page.getByText('Ajoutez encore 2 équipes')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Régler la donne' })
  ).toHaveCount(0);
  await ajouterJoueurs(page, ['Nous']);
  await expect(
    page.getByText('Ajoutez encore 1 équipe', { exact: true })
  ).toBeVisible();
});

test.describe('avec deux équipes', () => {
  test.beforeEach(async ({ page }) => {
    await ajouterJoueurs(page, ['Nous', 'Eux']);
  });

  test('R14 : onglets Calcul, Score, Règles ; colonne « Donne »', async ({
    page
  }) => {
    await expect(page.getByRole('tab')).toHaveText([
      'Calcul',
      'Score',
      'Règles'
    ]);
    await page.getByRole('tab', { name: 'Score' }).click();
    await expect(page.getByRole('columnheader').first()).toHaveText('Donne');
  });

  test('CON-02 : champs obligatoires nommés, dépendances Contré / Belote, brouillon', async ({
    page
  }) => {
    await page.getByRole('button', { name: 'Compter Nous' }).click();
    await expect(
      page.getByText('Sélectionnez l’équipe qui a enchéri')
    ).toBeVisible();
    await choisir(page, 'Équipe preneuse', 'Nous');
    await page.getByRole('button', { name: 'Compter Nous' }).click();
    await expect(page.getByText('Sélectionnez l’atout')).toBeVisible();

    await expect(interrupteur(page, 'Surcontré')).toHaveCount(0);
    await interrupteur(page, 'Contré').click();
    await interrupteur(page, 'Surcontré').click();
    await interrupteur(page, 'Contré').click();
    await expect(interrupteur(page, 'Surcontré')).toHaveCount(0);
    await interrupteur(page, 'Contré').click();
    await expect(interrupteur(page, 'Surcontré')).toHaveAttribute(
      'aria-checked',
      'false'
    );

    await interrupteur(page, 'Belote / Rebelote').click();
    await choisir(page, 'Équipe qui la détient', 'Eux');
    await interrupteur(page, 'Belote / Rebelote').click();
    await interrupteur(page, 'Belote / Rebelote').click();
    await expect(
      groupe(page, 'Équipe qui la détient').getByRole('radio', {
        checked: true
      })
    ).toHaveCount(0);

    await choisir(page, 'Atout', 'Pique');
    await page.reload();
    await expect(
      groupe(page, 'Atout').getByRole('radio', { name: 'Pique' })
    ).toHaveAttribute('aria-checked', 'true');
    await expect(interrupteur(page, 'Contré')).toHaveAttribute(
      'aria-checked',
      'true'
    );
  });

  test('[A] réglage de la donne', async ({ page }) => {
    await interrupteur(page, 'Contré').click();
    await interrupteur(page, 'Belote / Rebelote').click();
    await verifierAxe(page);
  });

  test('CON-03 : compter les cartes, atout une fois, 3 fois hors atout, annuler, recommencer', async ({
    page
  }) => {
    await regler(page);
    await page.getByRole('button', { name: 'Compter Nous' }).click();
    await expect(
      page.getByRole('heading', { name: 'Cartes de Nous' })
    ).toBeVisible();
    await carte(page, 'Valet d’atout').click();
    await carte(page, 'As d’atout').click();
    await carte(page, 'As hors atout').click();
    await expect(total(page)).toHaveText('42');
    await expect(carte(page, 'Valet d’atout')).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await carte(page, 'Valet d’atout').click();
    await expect(
      page.getByText('Le valet d’atout est déjà compté.')
    ).toBeVisible();
    await expect(total(page)).toHaveText('42');

    await carte(page, 'As hors atout').click();
    await carte(page, 'As hors atout').click();
    await carte(page, 'As hors atout').click();
    await expect(
      page.getByText('L’as hors atout est déjà compté 3 fois.')
    ).toBeVisible();
    await expect(total(page)).toHaveText('64');

    await carte(page, 'Dame d’atout').click();
    await page.getByRole('button', { name: 'Annuler dernier' }).click();
    await expect(carte(page, 'Dame d’atout')).toHaveAttribute(
      'aria-pressed',
      'false'
    );
    await expect(total(page)).toHaveText('64');

    await page.evaluate(
      () =>
        ((window as unknown as { sansRechargement: boolean }).sansRechargement =
          true)
    );
    await page.getByRole('button', { name: 'Recommencer le comptage' }).click();
    await expect(total(page)).toHaveText('0');
    await verifierAxe(page);
    await page
      .getByRole('status')
      .getByRole('button', { name: 'Annuler' })
      .click();
    await expect(total(page)).toHaveText('64');
    expect(
      await page.evaluate(
        () =>
          (window as unknown as { sansRechargement: boolean }).sansRechargement
      )
    ).toBe(true);
  });

  test('CON-04 : tous les plis masque les cartes ; capot sans cartes', async ({
    page
  }) => {
    await regler(page);
    await page.getByRole('button', { name: 'Compter Nous' }).click();
    await choisir(page, 'Une équipe a-t-elle remporté tous les plis ?', 'Eux');
    await expect(carte(page, 'Valet d’atout')).toHaveCount(0);
    await page.getByRole('button', { name: 'Voir le résultat' }).click();
    await expect(
      page.getByRole('region', { name: 'Résultat de la donne' })
    ).toContainText('Contrat chuté');
    await expect(
      page.getByRole('region', { name: 'Résultat de la donne' })
    ).toContainText(/Eux\s*330/);

    await page.getByRole('button', { name: 'Revenir au comptage' }).click();
    await page.getByRole('button', { name: 'Modifier le réglage' }).click();
    await page.getByLabel('Contrat').selectOption('Capot');
    await expect(groupe(page, 'Dix de der')).toHaveCount(0);
    await page.getByRole('button', { name: 'Compter Nous' }).click();
    await expect(carte(page, 'Valet d’atout')).toHaveCount(0);
    await choisir(page, 'Nous a-t-elle remporté tous les plis ?', 'Oui');
    await page.getByRole('button', { name: 'Voir le résultat' }).click();
    await expect(
      page.getByRole('region', { name: 'Résultat de la donne' })
    ).toContainText(/Nous\s*500/);
  });

  test('CON-05, CON-06 : même résultat en comptant l’autre équipe, puis comptabiliser', async ({
    page
  }) => {
    await regler(page, { dixDeDer: 'Nous' });
    await page.getByRole('button', { name: 'Compter Nous' }).click();
    for (const c of ['Valet d’atout', '9 d’atout', 'As d’atout'])
      await carte(page, c).click();
    await page.getByRole('button', { name: 'Voir le résultat' }).click();
    const resultat = page.getByRole('region', { name: 'Résultat de la donne' });
    await expect(resultat).toContainText('Contrat chuté');
    await expect(resultat).toContainText(/Nous\s*0.*Eux\s*240/);

    await page.getByRole('button', { name: 'Revenir au comptage' }).click();
    await page.getByRole('button', { name: 'Compter Eux' }).click();
    for (const c of ['10 d’atout', 'Roi d’atout', 'Dame d’atout'])
      await carte(page, c).click();
    for (const c of ['As', '10', 'Roi', 'Dame', 'Valet'])
      for (let i = 0; i < 3; i++) await carte(page, `${c} hors atout`).click();
    await expect(total(page)).toHaveText('107');
    await page.getByRole('button', { name: 'Voir le résultat' }).click();
    await expect(resultat).toContainText(/Nous\s*0.*Eux\s*240/);
    await verifierAxe(page);

    await page.getByRole('button', { name: 'Comptabiliser la manche' }).click();
    await expect(
      page.getByRole('heading', { name: 'Régler la donne' })
    ).toBeVisible();
    await expect(
      groupe(page, 'Équipe preneuse').getByRole('radio', { checked: true })
    ).toHaveCount(0);
    const toast = page
      .getByRole('status')
      .filter({ hasText: 'Donne 1 ajoutée' });
    await toast.getByRole('button', { name: 'Voir le score' }).click();
    await expect(page.getByRole('row').nth(1)).toHaveText(/^1\s*0\s*240/);
    await expect(
      page.getByRole('button', { name: 'Retirer la dernière donne' })
    ).toBeVisible();
  });

  test('CON-07 : capot contré à 1000, fin de partie et saisie impossible', async ({
    page
  }) => {
    await regler(page, { contrat: 'Capot' });
    await interrupteur(page, 'Contré').click();
    await page.getByRole('button', { name: 'Compter Nous' }).click();
    await choisir(page, 'Nous a-t-elle remporté tous les plis ?', 'Oui');
    await page.getByRole('button', { name: 'Voir le résultat' }).click();
    await page.getByRole('button', { name: 'Comptabiliser la manche' }).click();
    await expect(
      page.getByRole('heading', { name: 'Nous gagne la partie' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Régler la donne' })
    ).toHaveCount(0);
  });

  test('CON-08, CON-09 : barème, valeurs des cartes, lien FFB', async ({
    page
  }) => {
    await page.getByRole('tab', { name: 'Règles' }).click();
    await expect(
      page.getByText('Ce barème peut différer de la règle officielle.')
    ).toBeVisible();
    const valeurs = page.getByRole('table', { name: /Valeur de chaque carte/ });
    await expect(valeurs.getByRole('row', { name: /Valet/ })).toHaveText(
      /Valet\s*20\s*2/
    );
    await expect(
      page.getByRole('link', { name: /Règle officielle de la Belote Contrée/ })
    ).toHaveAttribute('href', /ffbelote\.org/);
    await verifierAxe(page);
  });
});
