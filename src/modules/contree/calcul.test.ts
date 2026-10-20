import { describe, expect, test } from 'vitest';
import {
  calculerDonne,
  CARTES,
  peutCliquer,
  pointsDesClics,
  statut,
  versEntree,
  type Contrat,
  type EntreeDonne,
  type Equipe
} from './calcul';
import cas from './cas-reference.json';

// Adaptateur de la spec 11 §8 : l'ancien format (Nous / Eux) vers calculerDonne (A / B).
const equipe = (nom: string): Equipe => (nom === 'Nous' ? 'A' : 'B');
function adapter(c: (typeof cas)[number]): EntreeDonne {
  const s = c.setup;
  const contrat = (
    s.contract === 'capot' ? 'capot' : Number(s.contract)
  ) as Contrat;
  return {
    preneuse: equipe(s.bid),
    contrat,
    multiplicateur: s.surcontre ? 4 : s.contre ? 2 : 1,
    belote: s.rebelote ? equipe(s.rebeloteTeam) : null,
    dernierPli: equipe(s.lastPli),
    cartes: { equipe: equipe(c.countedTeam), points: c.cardPoints },
    tousLesPlis: c.allTricksToggle
      ? equipe(contrat === 'capot' ? s.bid : c.countedTeam)
      : null
  };
}

describe('CON-10 : les cas de référence', () => {
  test('31 cas (29 de l’audit + 2 ajoutés)', () =>
    expect(cas).toHaveLength(31));
  test.each(cas.map((c) => [c.name, c] as const))('%s', (_, c) => {
    expect(calculerDonne(adapter(c))).toEqual({
      A: c.attendu.Nous,
      B: c.attendu.Eux
    });
  });
});

describe('R2 : l’équipe comptée ne change pas le résultat', () => {
  const autre = (e: Equipe): Equipe => (e === 'A' ? 'B' : 'A');
  test.each(
    cas
      .filter((c) => c.setup.contract !== 'capot' && !c.allTricksToggle)
      .map((c) => [c.name, c] as const)
  )('%s', (_, c) => {
    const e = adapter(c);
    const inverse = {
      ...e,
      cartes: { equipe: autre(e.cartes.equipe), points: 152 - e.cartes.points }
    };
    expect(calculerDonne(inverse)).toEqual(calculerDonne(e));
  });
  test('balayage : toutes les valeurs de cartes, contrats et multiplicateurs', () => {
    for (const contrat of [80, 100, 160] as const)
      for (const multiplicateur of [1, 2, 4] as const)
        for (let x = 0; x <= 152; x++) {
          const e: EntreeDonne = {
            preneuse: 'A',
            contrat,
            multiplicateur,
            belote: 'B',
            dernierPli: 'A',
            cartes: { equipe: 'A', points: x },
            tousLesPlis: null
          };
          expect(
            calculerDonne({ ...e, cartes: { equipe: 'B', points: 152 - x } })
          ).toEqual(calculerDonne(e));
        }
  });
});

describe('R5 : entrées invalides refusées', () => {
  const valide = adapter(cas[0]);
  test.each([
    ['points = 153', { ...valide, cartes: { equipe: 'A', points: 153 } }],
    ['points négatifs', { ...valide, cartes: { equipe: 'A', points: -1 } }],
    [
      'points non entiers',
      { ...valide, cartes: { equipe: 'A', points: 10.5 } }
    ],
    ['multiplicateur 3', { ...valide, multiplicateur: 3 }],
    ['contrat 85', { ...valide, contrat: 85 }],
    ['belote sans équipe valide', { ...valide, belote: 'C' }]
  ])('%s', (_, e) => {
    expect(() => calculerDonne(e as EntreeDonne)).toThrow(RangeError);
  });

  const reglage = {
    preneuse: 'a',
    atout: 'coeur',
    contrat: 100,
    belote: false,
    equipeBelote: null,
    contre: false,
    surcontre: false,
    dernierPli: 'a'
  } as const;
  const equipes = ['a', 'b'] as const;
  test('réglage complet → entrée', () => {
    expect(versEntree(reglage, equipes)).toMatchObject({
      preneuse: 'A',
      multiplicateur: 1,
      belote: null,
      dernierPli: 'A'
    });
  });
  test('surcontré sans contré refusé', () => {
    expect(versEntree({ ...reglage, surcontre: true }, equipes)).toEqual({
      erreur: 'Surcontré demande Contré'
    });
  });
  test.each([
    ['preneuse', { preneuse: null }, 'Sélectionnez l’équipe qui a enchéri'],
    ['atout', { atout: null }, 'Sélectionnez l’atout'],
    ['contrat', { contrat: null }, 'Sélectionnez la valeur du contrat'],
    ['belote sans équipe', { belote: true }, 'Sélectionnez l’équipe'],
    [
      'dix de der',
      { dernierPli: null },
      'Sélectionnez l’équipe qui remporte le dernier pli'
    ]
  ])('champ manquant : %s', (_, manque, message) => {
    expect(versEntree({ ...reglage, ...manque }, equipes)).toEqual({
      erreur: message
    });
  });
  test('capot : dix de der non demandé', () => {
    expect(
      versEntree({ ...reglage, contrat: 'capot', dernierPli: null }, equipes)
    ).not.toHaveProperty('erreur');
  });
});

describe('CON-03 : cartes', () => {
  test('valet d’atout + as d’atout + as hors atout = 42', () => {
    expect(pointsDesClics(['atout-valet', 'atout-as', 'hors-as'])).toBe(42);
  });
  test('toutes les cartes comptables = 152', () => {
    const toutes = CARTES.flatMap((c) => Array(c.atout ? 1 : 3).fill(c.id));
    expect(pointsDesClics(toutes)).toBe(152);
  });
  test('une carte d’atout une fois, une valeur hors atout trois fois', () => {
    expect(peutCliquer([], 'atout-valet')).toBe(true);
    expect(peutCliquer(['atout-valet'], 'atout-valet')).toBe(false);
    expect(peutCliquer(['hors-as', 'hors-as'], 'hors-as')).toBe(true);
    expect(peutCliquer(['hors-as', 'hors-as', 'hors-as'], 'hors-as')).toBe(
      false
    );
  });
});

describe('CON-07 : fin de partie à 1000', () => {
  test.each([
    [{ a: 1020, b: 640 }, true, ['a']],
    [{ a: 1000, b: 1100 }, true, ['b']],
    [{ a: 990, b: 990 }, false, []],
    [{ a: 1000, b: 1000 }, false, []],
    [{ a: 1050, b: 1030 }, true, ['a']]
  ])('%o', (totaux, terminee, gagnants) => {
    expect(statut(totaux)).toEqual({ terminee, gagnants });
  });
});
