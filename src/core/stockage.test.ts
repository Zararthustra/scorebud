import { beforeEach, describe, expect, test, vi } from 'vitest';
import { effacerTout, ecrire, lire, nettoyerAnciennesCles } from './stockage';

let donnees: Map<string, string>;
const faux = {
  getItem: vi.fn((k: string) => donnees.get(k) ?? null),
  setItem: vi.fn((k: string, v: string) => void donnees.set(k, v)),
  removeItem: vi.fn((k: string) => void donnees.delete(k)),
  key: (i: number) => [...donnees.keys()][i] ?? null,
  get length() {
    return donnees.size;
  }
};

beforeEach(() => {
  donnees = new Map();
  vi.clearAllMocks();
  vi.stubGlobal('localStorage', faux);
});

const estNombre = (v: unknown): v is { n: number } =>
  typeof (v as { n?: unknown })?.n === 'number';

describe('lire', () => {
  test('clé absente : null, sans signal', () => {
    expect(lire('scorebud:v2:x', estNombre)).toEqual({
      valeur: null,
      illisible: false
    });
  });
  test('valeur valide', () => {
    donnees.set('scorebud:v2:x', '{"n":3}');
    expect(lire('scorebud:v2:x', estNombre)).toEqual({
      valeur: { n: 3 },
      illisible: false
    });
  });
  test.each(['{pas du json', '{"n":"3"}', 'null'])(
    'GEN-03 : valeur corrompue %s → null + signal, autres clés intactes',
    (brut) => {
      donnees.set('scorebud:v2:x', brut);
      donnees.set('scorebud:v2:y', '{"n":1}');
      expect(lire('scorebud:v2:x', estNombre)).toEqual({
        valeur: null,
        illisible: true
      });
      expect(lire('scorebud:v2:y', estNombre).valeur).toEqual({ n: 1 });
    }
  );
  test('stockage bloqué : null, sans planter', () => {
    faux.getItem.mockImplementationOnce(() => {
      throw new Error('SecurityError');
    });
    expect(lire('scorebud:v2:x', estNombre).valeur).toBeNull();
  });
});

describe('ecrire', () => {
  test('réussite → true', () => {
    expect(ecrire('scorebud:v2:x', { n: 1 })).toBe(true);
    expect(donnees.get('scorebud:v2:x')).toBe('{"n":1}');
  });
  test('stockage plein → false', () => {
    faux.setItem.mockImplementationOnce(() => {
      throw new Error('QuotaExceededError');
    });
    expect(ecrire('scorebud:v2:x', { n: 1 })).toBe(false);
  });
});

test('GEN-10 : anciennes clés supprimées sans être lues', () => {
  for (const k of [
    'players',
    'contree',
    'calculate',
    'accessToken',
    'refreshToken'
  ])
    donnees.set(k, 'ancien');
  donnees.set('autre-site', 'garde');
  nettoyerAnciennesCles();
  expect([...donnees.keys()]).toEqual(['autre-site']);
  expect(faux.getItem).not.toHaveBeenCalled();
});

test('GEN-07 : seules les clés scorebud: sont effacées', () => {
  donnees.set('scorebud:v2:contree', '{}');
  donnees.set('scorebud:v2:prefs', '{}');
  donnees.set('autre-site', 'garde');
  donnees.set('players', 'garde');
  effacerTout();
  expect([...donnees.keys()]).toEqual(['autre-site', 'players']);
});
