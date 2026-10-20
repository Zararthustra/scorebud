import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

/** [A] : aucune violation axe, en clair puis en sombre (le thème suit le système en direct). */
export async function verifierAxe(page: Page) {
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme });
    // Le nouveau thème n'est calculé qu'à l'image suivante : sans cette attente, axe lirait encore l'ancien.
    await page.evaluate(
      () =>
        new Promise((r) =>
          requestAnimationFrame(() => requestAnimationFrame(r))
        )
    );
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(
      violations.map(
        (v) => `${v.id} : ${v.nodes.map((n) => n.target).join(', ')}`
      ),
      colorScheme
    ).toEqual([]);
  }
}

/** Ouvre la feuille des participants d'un jeu et y ajoute des noms. */
export async function ajouterJoueurs(page: Page, noms: string[]) {
  await page.getByRole('button', { name: 'Menu du jeu' }).click();
  await page.getByRole('button', { name: /^(Joueurs|Équipes)/ }).click();
  const champ = page.getByLabel('Nom');
  for (const nom of noms) {
    await champ.fill(nom);
    await champ.press('Enter');
  }
  await page.getByRole('button', { name: 'Terminé' }).click();
}

/**
 * Module factice : ajoute des points à un joueur depuis son onglet de saisie.
 * Le toast, en haut comme sur les maquettes, recouvre les onglets : on le ferme pour continuer.
 */
export async function ajouterPoints(
  page: Page,
  nom: string,
  points: number,
  fermerToast = true
) {
  await page.getByRole('tab', { name: 'Saisie' }).click();
  await page.getByLabel('Points').fill(String(points));
  await page.getByRole('button', { name: `Ajouter à ${nom}` }).click();
  if (fermerToast)
    await page
      .getByRole('status')
      .filter({ hasText: `Points ajoutés pour ${nom}` })
      .getByRole('button', { name: 'Fermer' })
      .click();
}
