// Living Forest (spec 12) : compteurs du tour, fonctions pures. Le compteur de l'ancienne version est conservé (principe 15).

export const RESSOURCES = [
  'plante',
  'soleil',
  'eau',
  'deplacement',
  'lotus',
  'kodama'
] as const;
export type Ressource = (typeof RESSOURCES)[number];
export type Ressources = Record<Ressource, number>;
export type PointsJoueur = { arbre: number; feu: number; lotus: number };

export const ressourcesVides = (): Ressources => ({
  plante: 0,
  soleil: 0,
  eau: 0,
  deplacement: 0,
  lotus: 0,
  kodama: 0
});

/** E1 : une ressource ne descend pas sous 0. */
export const borne = (n: number) => Math.max(0, n);

export const totauxRessources = (cartes: Ressources, arbres: Ressources) =>
  Object.fromEntries(
    RESSOURCES.map((r) => [r, cartes[r] + arbres[r]])
  ) as Ressources;

/** R19 : lotus des cartes + lotus des arbres + ajustement manuel, jamais négatif. */
export const lotusVictoire = (
  cartes: Ressources,
  arbres: Ressources,
  ajustement: number
) => borne(cartes.lotus + arbres.lotus + ajustement);

/** « − » sur le lotus des conditions de victoire : sans effet s'il affiche déjà 0. */
export const diminuerAjustement = (
  cartes: Ressources,
  arbres: Ressources,
  ajustement: number
) =>
  lotusVictoire(cartes, arbres, ajustement) > 0 ? ajustement - 1 : ajustement;

/** LF-03 : une unité = 1 point. */
export const totalJoueur = (p: PointsJoueur) => p.arbre + p.feu + p.lotus;
