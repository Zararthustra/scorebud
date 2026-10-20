import { expect, test } from 'vitest';
import { filtrerJeux, ordonnerJeux } from './ordreCatalogue';

const jeux = ['a', 'b', 'c', 'd'].map((id) => ({
  id,
  nom: `Jeu ${id.toUpperCase()}`
}));

test('récents d’abord, dans l’ordre d’ouverture, puis l’ordre de la liste', () => {
  expect(ordonnerJeux(jeux, ['c', 'a']).map((j) => j.id)).toEqual([
    'c',
    'a',
    'b',
    'd'
  ]);
});

test('un récent inconnu (module retiré) est ignoré', () => {
  expect(ordonnerJeux(jeux, ['zzz', 'd']).map((j) => j.id)).toEqual([
    'd',
    'a',
    'b',
    'c'
  ]);
});

test('recherche : sans accents ni casse, espaces ignorés', () => {
  const contree = { id: 'contree', nom: 'Belote Contrée' };
  expect(filtrerJeux([contree, ...jeux], '  contree ')).toEqual([contree]);
  expect(filtrerJeux(jeux, '')).toEqual(jeux);
});
