// Minuteur (spec 20 §2) : fonctions pures, durées en millisecondes.

export const PAS = 15_000;
export const DUREE_MIN = PAS;
export const DUREE_MAX = 59 * 60_000 + 45_000;
export const DUREE_PAR_DEFAUT = 45_000;

/** OUT-05 : le restant se déduit de l'heure de fin, pas d'un décompte seconde par seconde. */
export const restant = (heureDeFin: number, maintenant: number) =>
  Math.max(0, heureDeFin - maintenant);

/** « m:ss », seconde entamée comptée (0:00 seulement à la fin). */
export function formater(ms: number) {
  const s = Math.ceil(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** Pas de 15 s vers le multiple suivant ou précédent (le restant en pause n'en est pas forcément un), bornes 0:15 – 59:45. */
export function ajuster(duree: number, sens: 1 | -1) {
  const cible =
    sens > 0
      ? Math.floor(duree / PAS) * PAS + PAS
      : Math.ceil(duree / PAS) * PAS - PAS;
  return Math.min(DUREE_MAX, Math.max(DUREE_MIN, cible));
}
