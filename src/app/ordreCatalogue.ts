type Jeu = { id: string; nom: string };

/** Jeux ouverts récemment d'abord (spec 00 §4), puis l'ordre de `modules/index.ts`. */
export function ordonnerJeux<J extends Jeu>(jeux: J[], recents: string[]): J[] {
  const rang = (j: J) =>
    recents.includes(j.id) ? recents.indexOf(j.id) : recents.length;
  return [...jeux].sort((a, b) => rang(a) - rang(b));
}

const normaliser = (t: string) =>
  t
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

/** Recherche du catalogue (au-delà de 10 jeux) : casse et accents ignorés. */
export const filtrerJeux = <J extends Jeu>(jeux: J[], texte: string) =>
  jeux.filter((j) => normaliser(j.nom).includes(normaliser(texte)));
