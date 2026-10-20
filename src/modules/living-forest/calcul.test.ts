import { describe, expect, test } from 'vitest';
import {
  borne,
  diminuerAjustement,
  lotusVictoire,
  ressourcesVides,
  totalJoueur,
  totauxRessources
} from './calcul';

describe('LF-01 : compteurs bornés à 0', () => {
  test.each([
    [0, -1, 0],
    [3, -1, 2],
    [0, 1, 1]
  ])('%i %+i → %i', (v, pas, attendu) => expect(borne(v + pas)).toBe(attendu));
});

describe('LF-02 : totaux et lotus des conditions de victoire', () => {
  const cartes = { ...ressourcesVides(), plante: 2, soleil: 3, lotus: 2 };
  const arbres = {
    ...ressourcesVides(),
    plante: 1,
    eau: 1,
    lotus: 1,
    kodama: 2
  };
  test('totaux = cartes + arbres', () => {
    expect(totauxRessources(cartes, arbres)).toEqual({
      plante: 3,
      soleil: 3,
      eau: 1,
      deplacement: 0,
      lotus: 3,
      kodama: 2
    });
  });
  test('2 + 1 lotus et un ajustement de +1 → 4 ; lotus des cartes à 3 → 5', () => {
    expect(lotusVictoire(cartes, arbres, 1)).toBe(4);
    expect(lotusVictoire({ ...cartes, lotus: 3 }, arbres, 1)).toBe(5);
  });
  test('« − » ne fait jamais passer le lotus sous 0, l’affichage non plus', () => {
    const sansLotus = ressourcesVides();
    expect(diminuerAjustement(sansLotus, sansLotus, 0)).toBe(0);
    expect(diminuerAjustement(cartes, arbres, 0)).toBe(-1);
    expect(diminuerAjustement(cartes, arbres, -3)).toBe(-3);
    expect(lotusVictoire(sansLotus, sansLotus, -2)).toBe(0);
  });
});

test('LF-03 : total d’un joueur = arbres + feux + lotus', () => {
  expect(totalJoueur({ arbre: 3, feu: 2, lotus: 1 })).toBe(6);
  expect(totalJoueur({ arbre: 0, feu: 0, lotus: 0 })).toBe(0);
});

test('LF-07 : pas de fin de partie', async () => {
  const { default: livingForest } = await import('./module');
  expect(livingForest.statut).toBeUndefined();
});
