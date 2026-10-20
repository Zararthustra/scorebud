// Règle de comptage de la Belote Contrée (spec 11 §5, Décidé) : fonctions pures, sans état ni interface.

export type Equipe = 'A' | 'B';
export type Contrat =
  80 | 90 | 100 | 110 | 120 | 130 | 140 | 150 | 160 | 'capot';
export const CONTRATS: Contrat[] = [
  80,
  90,
  100,
  110,
  120,
  130,
  140,
  150,
  160,
  'capot'
];

export type EntreeDonne = {
  preneuse: Equipe;
  contrat: Contrat;
  multiplicateur: 1 | 2 | 4; // rien, contré, surcontré
  belote: Equipe | null; // équipe qui la détient
  dernierPli: Equipe; // dix de der (ignoré si capot ou tous les plis)
  cartes: { equipe: Equipe; points: number }; // cartes de l'équipe comptée, 0..152, hors dix de der et belote
  tousLesPlis: Equipe | null;
};

const TOTAL_CARTES = 152;
const autre = (e: Equipe): Equipe => (e === 'A' ? 'B' : 'A');
const arrondir = (n: number) => Math.floor((n + 5) / 10) * 10; // dizaine la plus proche, 5 vers le haut

/** Points de la donne pour A et B (spec 11 §5.1). Refuse une entrée invalide (R5). */
export function calculerDonne(e: EntreeDonne): { A: number; B: number } {
  const { points } = e.cartes;
  if (!Number.isInteger(points) || points < 0 || points > TOTAL_CARTES)
    throw new RangeError(`Points de cartes invalides : ${points}`);
  if (![1, 2, 4].includes(e.multiplicateur))
    throw new RangeError('Multiplicateur invalide');
  if (!CONTRATS.includes(e.contrat)) throw new RangeError('Contrat invalide');
  if (e.belote !== null && e.belote !== 'A' && e.belote !== 'B')
    throw new RangeError('Équipe de belote invalide');

  const P = e.preneuse;
  const D = autre(P);
  const m = e.multiplicateur;
  const cartes = {
    [e.cartes.equipe]: points,
    [autre(e.cartes.equipe)]: TOTAL_CARTES - points
  } as Record<Equipe, number>;
  const pli = (x: Equipe) => cartes[x] + (e.dernierPli === x ? 10 : 0);
  const belote = (x: Equipe) => (e.belote === x ? 20 : 0);
  const res = { A: 0, B: 0 };

  if (e.contrat === 'capot') {
    const rempli = e.tousLesPlis === P;
    res[rempli ? P : D] = 500 * m;
  } else {
    const v = e.contrat;
    const rempli =
      e.tousLesPlis !== null ? e.tousLesPlis === P : pli(P) + belote(P) >= v;
    const base = e.tousLesPlis !== null ? 250 : 160;
    if (m > 1) res[rempli ? P : D] = m * (base + v);
    else if (!rempli) res[D] = base + v;
    else if (e.tousLesPlis !== null) res[P] = 250 + v;
    else {
      res[P] = arrondir(pli(P)) + v;
      res[D] = arrondir(pli(D));
    }
  }
  if (e.belote) res[e.belote] += 20; // jamais multipliée, jamais arrondie
  return res;
}

// --- Réglage de la donne (§3.1) ---------------------------------------------------------

export type Atout = 'trefle' | 'coeur' | 'pique' | 'carreau';
export type Reglage = {
  preneuse: string | null; // id de participant
  atout: Atout | null;
  contrat: Contrat | null;
  belote: boolean;
  equipeBelote: string | null;
  contre: boolean;
  surcontre: boolean;
  dernierPli: string | null;
};

export const reglageVide = (): Reglage => ({
  preneuse: null,
  atout: null,
  contrat: null,
  belote: false,
  equipeBelote: null,
  contre: false,
  surcontre: false,
  dernierPli: null
});

/** Réglage complet → entrée de calcul (sans cartes), ou le message du premier champ manquant (T4, T8). */
export function versEntree(
  r: Reglage,
  [idA, idB]: readonly [string, string] | string[]
): Omit<EntreeDonne, 'cartes' | 'tousLesPlis'> | { erreur: string } {
  const equipe = (id: string | null): Equipe | null =>
    id === idA ? 'A' : id === idB ? 'B' : null;
  const preneuse = equipe(r.preneuse);
  if (!preneuse) return { erreur: 'Sélectionnez l’équipe qui a enchéri' };
  if (!r.atout) return { erreur: 'Sélectionnez l’atout' };
  if (!r.contrat) return { erreur: 'Sélectionnez la valeur du contrat' };
  const belote = r.belote ? equipe(r.equipeBelote) : null;
  if (r.belote && !belote) return { erreur: 'Sélectionnez l’équipe' };
  // Capot : le dix de der est sans effet, il n'est pas demandé.
  const dernierPli = r.contrat === 'capot' ? preneuse : equipe(r.dernierPli);
  if (!dernierPli)
    return { erreur: 'Sélectionnez l’équipe qui remporte le dernier pli' };
  if (r.surcontre && !r.contre) return { erreur: 'Surcontré demande Contré' };
  return {
    preneuse,
    contrat: r.contrat,
    multiplicateur: r.surcontre ? 4 : r.contre ? 2 : 1,
    belote,
    dernierPli
  };
}

// --- Cartes (§3.2, §5.2) ------------------------------------------------------------------

export type CarteId = (typeof CARTES)[number]['id'];
export const CARTES = [
  { id: 'atout-valet', nom: 'Valet', atout: true, points: 20 },
  { id: 'atout-9', nom: '9', atout: true, points: 14 },
  { id: 'atout-as', nom: 'As', atout: true, points: 11 },
  { id: 'atout-10', nom: '10', atout: true, points: 10 },
  { id: 'atout-roi', nom: 'Roi', atout: true, points: 4 },
  { id: 'atout-dame', nom: 'Dame', atout: true, points: 3 },
  { id: 'hors-as', nom: 'As', atout: false, points: 11 },
  { id: 'hors-10', nom: '10', atout: false, points: 10 },
  { id: 'hors-roi', nom: 'Roi', atout: false, points: 4 },
  { id: 'hors-dame', nom: 'Dame', atout: false, points: 3 },
  { id: 'hors-valet', nom: 'Valet', atout: false, points: 2 }
] as const;

const carte = (id: string) => CARTES.find((c) => c.id === id);

export const pointsDesClics = (clics: readonly string[]) =>
  clics.reduce((s, id) => s + (carte(id)?.points ?? 0), 0);

/** Une carte d'atout se compte une fois ; une valeur hors atout trois fois au plus (3 couleurs, P10). */
export const peutCliquer = (clics: readonly string[], id: string) =>
  clics.filter((c) => c === id).length < (carte(id)?.atout ? 1 : 3);

// --- Fin de partie (§6) ------------------------------------------------------------------

export const SEUIL = 1000;

/** Terminée si une équipe atteint 1000 et que les totaux diffèrent (égalité : donne de départage). */
export function statut(totaux: Record<string, number>) {
  const valeurs = Object.values(totaux);
  const max = Math.max(...valeurs);
  const terminee = max >= SEUIL && new Set(valeurs).size > 1;
  return {
    terminee,
    gagnants: terminee
      ? Object.keys(totaux).filter((id) => totaux[id] === max)
      : []
  };
}
