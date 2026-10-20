import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  creerMagasin,
  DELAI_ANNULATION,
  type DefinitionPartie
} from './magasin';
import { nouvellePartie, retirerDerniereSaisie, type Partie } from './partie';

type B = { n: number };
const jeu: DefinitionPartie<B> = {
  id: 'test',
  brouillonVide: () => ({ n: 0 }),
  estBrouillon: (v): v is B => typeof (v as B)?.n === 'number'
};
const autre: DefinitionPartie<B> = { ...jeu, id: 'autre' };

const enCours: Partie<B> = {
  schemaVersion: 1,
  participants: [
    { id: 'a', nom: 'A' },
    { id: 'b', nom: 'B' }
  ],
  saisies: [{ points: { a: 1, b: 2 } }, { points: { a: 3, b: 4 } }],
  brouillon: { n: 7 },
  onglet: 'score'
};

let donnees: Map<string, string>;
let plein: boolean;
beforeEach(() => {
  donnees = new Map();
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => donnees.get(k) ?? null,
    setItem: (k: string, v: string) => {
      if (plein) throw new Error('QuotaExceededError');
      donnees.set(k, v);
    },
    removeItem: (k: string) => void donnees.delete(k),
    key: (i: number) => [...donnees.keys()][i] ?? null,
    get length() {
      return donnees.size;
    }
  });
  plein = false;
  vi.useFakeTimers();
});
afterEach(() => vi.useRealTimers());

describe('lecture et écriture', () => {
  test('sans stockage : partie vide avec le brouillon vide du module', () => {
    expect(creerMagasin().partie(jeu)).toEqual({
      schemaVersion: 1,
      participants: [],
      saisies: [],
      brouillon: { n: 0 }
    });
  });
  test('écrit à chaque changement et relit après redémarrage', () => {
    creerMagasin().modifier(jeu, enCours);
    expect(creerMagasin().partie(jeu)).toEqual(enCours);
  });
  test.each([
    ['version inconnue', { ...enCours, schemaVersion: 2 }],
    ['brouillon invalide', { ...enCours, brouillon: { n: 'x' } }],
    ['participant sans nom', { ...enCours, participants: [{ id: 'a' }] }],
    ['point non numérique', { ...enCours, saisies: [{ points: { a: null } }] }]
  ])('GEN-03 : %s → partie vide, les autres modules intacts', (_, valeur) => {
    donnees.set('scorebud:v2:test', JSON.stringify(valeur));
    donnees.set('scorebud:v2:autre', JSON.stringify(enCours));
    const m = creerMagasin();
    expect(m.partie(jeu).saisies).toEqual([]);
    expect(m.partie(autre)).toEqual(enCours);
  });
  test('prévient les abonnés', () => {
    const m = creerMagasin();
    const abonne = vi.fn();
    m.abonner(abonne);
    m.modifier(jeu, enCours);
    expect(abonne).toHaveBeenCalled();
  });
});

describe('T1 : faireAnnulable', () => {
  test('annuler restaure l’état exact', () => {
    const m = creerMagasin();
    m.modifier(jeu, enCours);
    m.faireAnnulable(
      jeu,
      nouvellePartie(m.partie(jeu), jeu.brouillonVide),
      'Nouvelle partie'
    );
    expect(m.annulable()?.message).toBe('Nouvelle partie');
    m.annuler();
    expect(m.partie(jeu)).toEqual(enCours);
    expect(creerMagasin().partie(jeu)).toEqual(enCours);
    expect(m.annulable()).toBeNull();
  });
  test('après 5 s, l’action est définitive', () => {
    const m = creerMagasin();
    m.modifier(jeu, enCours);
    m.faireAnnulable(
      jeu,
      retirerDerniereSaisie(m.partie(jeu)),
      'Saisie retirée'
    );
    vi.advanceTimersByTime(DELAI_ANNULATION - 1);
    expect(m.annulable()).not.toBeNull();
    vi.advanceTimersByTime(1);
    expect(m.annulable()).toBeNull();
    m.annuler();
    expect(m.partie(jeu).saisies).toHaveLength(1);
  });
  test('une nouvelle action annulable remplace la précédente', () => {
    const m = creerMagasin();
    m.modifier(jeu, enCours);
    m.faireAnnulable(
      jeu,
      retirerDerniereSaisie(m.partie(jeu)),
      'Saisie retirée'
    );
    m.faireAnnulable(
      jeu,
      retirerDerniereSaisie(m.partie(jeu)),
      'Saisie retirée'
    );
    m.annuler();
    expect(m.partie(jeu).saisies).toHaveLength(1);
  });
  test('une modification de la même partie rend l’action définitive (rien de plus récent n’est perdu)', () => {
    const m = creerMagasin();
    m.modifier(jeu, enCours);
    m.faireAnnulable(
      jeu,
      nouvellePartie(m.partie(jeu), jeu.brouillonVide),
      'Nouvelle partie'
    );
    m.modifier(jeu, {
      ...m.partie(jeu),
      saisies: [{ points: { a: 9, b: 9 } }]
    });
    expect(m.annulable()).toBeNull();
    expect(m.partie(jeu).saisies).toEqual([{ points: { a: 9, b: 9 } }]);
  });
  test('une modification d’une autre partie ne l’annule pas', () => {
    const m = creerMagasin();
    m.modifier(jeu, enCours);
    m.faireAnnulable(
      jeu,
      nouvellePartie(m.partie(jeu), jeu.brouillonVide),
      'Nouvelle partie'
    );
    m.modifier(autre, enCours);
    m.annuler();
    expect(m.partie(jeu)).toEqual(enCours);
  });
});

describe('transformations', () => {
  test('MOD-05 : nouvelle partie garde les participants, vide saisies et brouillon', () => {
    expect(nouvellePartie(enCours, jeu.brouillonVide)).toEqual({
      ...enCours,
      saisies: [],
      brouillon: { n: 0 }
    });
  });
  test('MOD-04 : retirer la dernière saisie', () => {
    expect(retirerDerniereSaisie(enCours).saisies).toEqual([
      { points: { a: 1, b: 2 } }
    ]);
  });
});

describe('T1 : ce qui ne rend pas l’action définitive', () => {
  test('changer d’onglet ou de brouillon garde Annuler ; Annuler garde l’onglet ouvert', () => {
    const m = creerMagasin();
    m.modifier(jeu, enCours);
    m.faireAnnulable(
      jeu,
      retirerDerniereSaisie(m.partie(jeu)),
      'Saisie retirée'
    );
    m.modifier(jeu, {
      ...m.partie(jeu),
      onglet: 'regles',
      brouillon: { n: 1 }
    });
    expect(m.annulable()).not.toBeNull();
    m.annuler();
    expect(m.partie(jeu)).toEqual({ ...enCours, onglet: 'regles' });
  });
});

describe('préférences', () => {
  test('par défaut : thème système, aucun récent', () => {
    expect(creerMagasin().preferences()).toEqual({
      schemaVersion: 1,
      theme: 'systeme',
      recents: []
    });
  });
  test('écrites et relues', () => {
    creerMagasin().modifierPreferences({
      schemaVersion: 1,
      theme: 'sombre',
      recents: ['test']
    });
    expect(creerMagasin().preferences().theme).toBe('sombre');
  });
  test('illisibles : valeurs par défaut', () => {
    donnees.set(
      'scorebud:v2:prefs',
      '{"schemaVersion":1,"theme":"rose","recents":[]}'
    );
    expect(creerMagasin().preferences().theme).toBe('systeme');
  });
});

describe('erreurs de stockage', () => {
  test('GEN-03 : écriture impossible signalée, l’application continue en mémoire', () => {
    const m = creerMagasin();
    plein = true;
    m.modifier(jeu, enCours);
    expect(m.nonEnregistre()).toBe(true);
    expect(m.partie(jeu)).toEqual(enCours);
    plein = false;
    m.modifier(jeu, enCours);
    expect(m.nonEnregistre()).toBe(false);
  });
  test('GEN-03 : partie illisible signalée une seule fois', () => {
    donnees.set('scorebud:v2:test', '{illisible');
    const surIllisible = vi.fn();
    const m = creerMagasin(surIllisible);
    m.partie(jeu);
    m.partie(jeu);
    m.partie(autre);
    expect(surIllisible).toHaveBeenCalledTimes(1);
    expect(surIllisible).toHaveBeenCalledWith('test');
  });
});

test('GEN-07 : effacer tout vide le stockage et la mémoire', () => {
  const m = creerMagasin();
  m.modifier(jeu, enCours);
  m.modifierPreferences({
    schemaVersion: 1,
    theme: 'clair',
    recents: ['test']
  });
  donnees.set('autre-site', 'garde');
  m.effacerTout();
  expect([...donnees.keys()]).toEqual(['autre-site']);
  expect(m.partie(jeu).participants).toEqual([]);
  expect(m.preferences().theme).toBe('systeme');
});
