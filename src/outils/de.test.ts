import { expect, test } from 'vitest';
import { lancer } from './de';

test('OUT-01 : une valeur de 1 à 6 selon le générateur fourni', () => {
  expect(lancer(() => 0)).toBe(1);
  expect(lancer(() => 0.5)).toBe(4);
  expect(lancer(() => 0.9999)).toBe(6);
});

test('OUT-01 : la même valeur peut sortir deux fois de suite', () => {
  const suite = [0.1, 0.1];
  expect([lancer(() => suite[0]), lancer(() => suite[1])]).toEqual([1, 1]);
});

test('Math.random par défaut : toujours entre 1 et 6', () => {
  for (let i = 0; i < 1000; i++) expect([1, 2, 3, 4, 5, 6]).toContain(lancer());
});
