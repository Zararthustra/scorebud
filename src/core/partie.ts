export type ParticipantId = string;
export type Points = Record<ParticipantId, number>;
export type Participant = { id: ParticipantId; nom: string };
export type Saisie = { points: Points };

export type Partie<B> = {
  schemaVersion: 1;
  participants: Participant[];
  saisies: Saisie[]; // journal (spec 01 §4)
  brouillon: B;
  onglet?: string;
};

export type Ligne = { scores: (number | null)[]; meilleurs: ParticipantId[] };

export const NOM_MAX = 15;

/** Tableau dérivé du journal (spec 01 §7) : la colonne d'un participant liste ses points dans l'ordre des saisies qui le concernent. */
export function tableau(
  participants: Participant[],
  saisies: Saisie[]
): { lignes: Ligne[]; totaux: Points } {
  const colonnes = participants.map((p) =>
    saisies.filter((s) => p.id in s.points).map((s) => s.points[p.id])
  );
  const hauteur = Math.max(0, ...colonnes.map((c) => c.length));
  const lignes = Array.from({ length: hauteur }, (_, i) => {
    const scores = colonnes.map((c) => c[i] ?? null);
    const presents = scores.filter((s) => s !== null);
    const max = Math.max(...presents);
    const meilleurs =
      presents.length >= 2 && presents.some((s) => s !== max)
        ? participants.filter((_, j) => scores[j] === max).map((p) => p.id)
        : [];
    return { scores, meilleurs };
  });
  const totaux = Object.fromEntries(
    participants.map((p, j) => [p.id, colonnes[j].reduce((a, b) => a + b, 0)])
  );
  return { lignes, totaux };
}

/** Nom normalisé (espaces retirés, majuscule initiale) ou message d'erreur (MOD-02). */
export function validerNom(
  saisi: string,
  existants: Participant[]
): { nom: string } | { erreur: string } {
  const brut = saisi.trim();
  if (!brut) return { erreur: 'Entrez un nom.' };
  if (brut.length > NOM_MAX) return { erreur: `${NOM_MAX} caractères maximum` };
  const nom = brut.charAt(0).toLocaleUpperCase('fr') + brut.slice(1);
  const pris = existants.some(
    (p) => p.nom.toLocaleLowerCase('fr') === nom.toLocaleLowerCase('fr')
  );
  return pris
    ? { erreur: 'Ce nom est déjà pris. Choisissez-en un autre.' }
    : { nom };
}

export const partieVide = <B>(brouillon: B): Partie<B> => ({
  schemaVersion: 1,
  participants: [],
  saisies: [],
  brouillon
});

/** MOD-05 : garde les participants, vide saisies et brouillon. */
export const nouvellePartie = <B>(
  p: Partie<B>,
  brouillonVide: () => B
): Partie<B> => ({
  ...p,
  saisies: [],
  brouillon: brouillonVide()
});

/** MOD-04 */
export const retirerDerniereSaisie = <B>(p: Partie<B>): Partie<B> => ({
  ...p,
  saisies: p.saisies.slice(0, -1)
});

const estObjet = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** Lecture défensive du stockage (spec 00 §5) : toute structure inattendue est refusée. */
export function estPartie<B>(
  v: unknown,
  estBrouillon: (b: unknown) => b is B
): v is Partie<B> {
  return (
    estObjet(v) &&
    v.schemaVersion === 1 &&
    Array.isArray(v.participants) &&
    v.participants.every(
      (p) =>
        estObjet(p) && typeof p.id === 'string' && typeof p.nom === 'string'
    ) &&
    Array.isArray(v.saisies) &&
    v.saisies.every(
      (s) =>
        estObjet(s) &&
        estObjet(s.points) &&
        Object.values(s.points).every(Number.isFinite)
    ) &&
    estBrouillon(v.brouillon) &&
    (v.onglet === undefined || typeof v.onglet === 'string')
  );
}

/** R10 : la case (ligne, participant) est la n-ième saisie qui concerne ce participant, comme dans `tableau`. */
export function modifierCase(
  saisies: Saisie[],
  ligne: number,
  id: ParticipantId,
  valeur: number
): Saisie[] {
  const cible = saisies.filter((s) => id in s.points)[ligne];
  return saisies.map((s) =>
    s === cible ? { points: { ...s.points, [id]: valeur } } : s
  );
}
