import { describe, expect, test } from 'vitest';
import { tableau, validerNom, type Participant, type Points } from './partie';

const joueurs = (...noms: string[]): Participant[] =>
  noms.map((nom) => ({ id: nom.toLowerCase(), nom }));
const manches = (...points: Points[]) => points.map((p) => ({ points: p }));
const abc = joueurs('A', 'B', 'C');

describe('MOD-03 : meilleur score d’une ligne', () => {
  test.each([
    [{ a: 10, b: 5, c: 5 }, ['a']],
    [{ a: 5, b: 5, c: 5 }, []],
    [{ a: 10, b: 10, c: 5 }, ['a', 'b']],
    [{ a: 10 }, []]
  ])('%o → %o', (points, attendu) => {
    expect(tableau(abc, manches(points)).lignes[0].meilleurs).toEqual(attendu);
  });

  test('une case manquante affiche « pas de score » et n’entre pas dans le total', () => {
    const t = tableau(abc, manches({ a: 4, b: 3, c: 2 }, { a: 1, c: 1 }));
    expect(t.lignes[1].scores).toEqual([1, null, 1]);
    expect(t.totaux).toEqual({ a: 5, b: 3, c: 3 });
  });
});

describe('SCO-03 : totaux et mises en avant', () => {
  const t = tableau(abc, manches({ a: 10, b: 5, c: 5 }, { a: -3, b: 4, c: 4 }));
  test('totaux (7, 9, 9), un score négatif compte négativement', () =>
    expect(t.totaux).toEqual({ a: 7, b: 9, c: 9 }));
  test('manche 1 : joueur 1 ; manche 2 : joueurs 2 et 3', () => {
    expect(t.lignes.map((l) => l.meilleurs)).toEqual([['a'], ['b', 'c']]);
  });
  test('valeurs toutes négatives : le plus haut reste le meilleur', () => {
    expect(
      tableau(abc, manches({ a: -1, b: -5, c: -5 })).lignes[0].meilleurs
    ).toEqual(['a']);
  });
});

describe('LF-04 : scores décalés (une saisie par joueur)', () => {
  const t = tableau(joueurs('A', 'B'), manches({ a: 3 }, { b: 5 }, { a: 2 }));
  test('chaque colonne liste ses points dans l’ordre, lignes = plus longue colonne', () => {
    expect(t.lignes.map((l) => l.scores)).toEqual([
      [3, 5],
      [2, null]
    ]);
  });
  test('la mise en avant ne compare que les scores présents', () => {
    expect(t.lignes.map((l) => l.meilleurs)).toEqual([['b'], []]);
  });
  test('totaux', () => expect(t.totaux).toEqual({ a: 5, b: 5 }));
  test('participant sans saisie : total 0', () => {
    expect(tableau(abc, manches({ a: 1 })).totaux).toEqual({
      a: 1,
      b: 0,
      c: 0
    });
  });
});

describe('MOD-02 : noms', () => {
  const existants = joueurs('Alice');
  test('vide ou espaces seuls', () => {
    expect(validerNom('', existants)).toEqual({ erreur: 'Entrez un nom.' });
    expect(validerNom('   ', existants)).toEqual({ erreur: 'Entrez un nom.' });
  });
  test('doublon, casse et espaces ignorés', () => {
    expect(validerNom('  aLICE ', existants)).toEqual({
      erreur: 'Ce nom est déjà pris. Choisissez-en un autre.'
    });
    expect(validerNom('alice', existants)).toEqual({
      erreur: 'Ce nom est déjà pris. Choisissez-en un autre.'
    });
  });
  test('15 caractères acceptés, 16 refusés', () => {
    expect(validerNom('a'.repeat(15), [])).toEqual({
      nom: 'A' + 'a'.repeat(14)
    });
    expect(validerNom('a'.repeat(16), [])).toEqual({
      erreur: '15 caractères maximum'
    });
  });
  test('espaces retirés, majuscule initiale, reste inchangé', () => {
    expect(validerNom('  éloïse dU bois ', [])).toEqual({
      nom: 'Éloïse dU bois'
    });
  });
});
