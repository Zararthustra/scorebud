import { describe, expect, test } from 'vitest';
import {
  ajuster,
  DUREE_MAX,
  DUREE_MIN,
  DUREE_PAR_DEFAUT,
  formater,
  restant
} from './minuteur';

describe('formater (« m:ss »)', () => {
  test.each([
    [45_000, '0:45'],
    [60_000, '1:00'],
    [DUREE_MAX, '59:45'],
    [0, '0:00'],
    [14_001, '0:15'],
    [999, '0:01']
  ])('%i ms → %s', (ms, texte) => expect(formater(ms)).toBe(texte));
});

describe('ajuster : pas de 15 s, bornes 0:15 et 59:45', () => {
  test('défaut 0:45', () => expect(DUREE_PAR_DEFAUT).toBe(45_000));
  test.each([
    [45_000, 1, 60_000],
    [45_000, -1, 30_000],
    [DUREE_MIN, -1, DUREE_MIN],
    [DUREE_MAX, 1, DUREE_MAX],
    [22_000, 1, 30_000],
    [22_000, -1, 15_000]
  ])('%i ms %+i pas → %i', (duree, sens, attendu) =>
    expect(ajuster(duree, sens as 1 | -1)).toBe(attendu)
  );
});

describe('OUT-05 : restant calculé sur l’heure de fin', () => {
  test('page suspendue 20 s : le temps restant est juste au retour', () => {
    const fin = 1_000_000 + 45_000;
    expect(restant(fin, 1_000_000 + 20_000)).toBe(25_000);
  });
  test('jamais négatif', () => expect(restant(1000, 5000)).toBe(0));
});
