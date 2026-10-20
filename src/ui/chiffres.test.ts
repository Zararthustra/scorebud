import { describe, expect, test } from 'vitest';
import { CHIFFRES, depuisChiffres, versChiffres } from './chiffres';

describe('molettes : versChiffres / depuisChiffres (P13 : 6 chiffres)', () => {
  test.each([
    [0, '+', [0, 0, 0, 0, 0, 0]],
    [1234, '+', [0, 0, 1, 2, 3, 4]],
    [-3, '−', [0, 0, 0, 0, 0, 3]],
    [999999, '+', [9, 9, 9, 9, 9, 9]],
    [-999999, '−', [9, 9, 9, 9, 9, 9]]
  ] as const)('%i ↔ %s %o', (n, signe, chiffres) => {
    expect(versChiffres(n)).toEqual({ signe, chiffres });
    expect(depuisChiffres(signe, [...chiffres])).toBe(n);
  });
  test('au-delà des bornes : ramené à ±999999', () => {
    expect(versChiffres(1234567).chiffres).toEqual([9, 9, 9, 9, 9, 9]);
    expect(versChiffres(-1234567).signe).toBe('−');
  });
  test('« − » sur zéro donne 0, jamais −0', () => {
    expect(Object.is(depuisChiffres('−', Array(CHIFFRES).fill(0)), 0)).toBe(
      true
    );
  });
});
