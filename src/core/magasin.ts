import { estPartie, partieVide, type Partie } from './partie';
import { ecrire, effacerTout as effacerStockage, lire } from './stockage';

/** Ce que le magasin doit savoir d'un module pour lire sa partie. */
export type DefinitionPartie<B> = {
  id: string;
  brouillonVide: () => B;
  estBrouillon: (v: unknown) => v is B;
};

export type Theme = 'systeme' | 'clair' | 'sombre';
export type Preferences = { schemaVersion: 1; theme: Theme; recents: string[] };

export const DELAI_ANNULATION = 5000;

const cle = (id: string) => `scorebud:v2:${id}`;
const CLE_PREFS = cle('prefs');
const prefsParDefaut = (): Preferences => ({
  schemaVersion: 1,
  theme: 'systeme',
  recents: []
});

const estPreferences = (v: unknown): v is Preferences => {
  const p = v as Preferences;
  return (
    typeof v === 'object' &&
    v !== null &&
    p.schemaVersion === 1 &&
    ['systeme', 'clair', 'sombre'].includes(p.theme) &&
    Array.isArray(p.recents) &&
    p.recents.every((r) => typeof r === 'string')
  );
};

/** Une partie par module, en mémoire et écrite à chaque changement ; annulation T1 en un seul endroit. */
export function creerMagasin(surIllisible: (id: string) => void = () => {}) {
  const parties = new Map<string, Partie<unknown>>();
  const abonnes = new Set<() => void>();
  let prefs: Preferences | undefined;
  let nonEnregistre = false;
  let annulable: {
    id: string;
    message: string;
    avant: Partie<unknown>;
  } | null = null;
  let minuterie: ReturnType<typeof setTimeout> | undefined;

  const notifier = () => abonnes.forEach((f) => f());

  const oublierAnnulable = () => {
    clearTimeout(minuterie);
    annulable = null;
  };

  const persister = (c: string, valeur: unknown) => {
    nonEnregistre = !ecrire(c, valeur);
  };

  function partie<B>(def: DefinitionPartie<B>): Partie<B> {
    if (!parties.has(def.id)) {
      const { valeur, illisible } = lire(cle(def.id), (v): v is Partie<B> =>
        estPartie(v, def.estBrouillon)
      );
      parties.set(def.id, valeur ?? partieVide(def.brouillonVide()));
      if (illisible) surIllisible(def.id);
    }
    return parties.get(def.id) as Partie<B>;
  }

  function enregistrer(id: string, p: Partie<unknown>) {
    parties.set(id, p);
    persister(cle(id), p);
  }

  /** Changer saisies ou participants rend définitive l'action annulable en cours sur la partie : Annuler ne doit rien effacer de plus récent. */
  function modifier<B>(def: DefinitionPartie<B>, p: Partie<B>) {
    const actuelle = partie(def);
    if (
      annulable?.id === def.id &&
      (p.saisies !== actuelle.saisies ||
        p.participants !== actuelle.participants)
    )
      oublierAnnulable();
    enregistrer(def.id, p);
    notifier();
  }

  function faireAnnulable<B>(
    def: DefinitionPartie<B>,
    p: Partie<B>,
    message: string
  ) {
    const avant = partie(def);
    oublierAnnulable();
    enregistrer(def.id, p);
    annulable = { id: def.id, message, avant };
    minuterie = setTimeout(() => {
      annulable = null;
      notifier();
    }, DELAI_ANNULATION);
    notifier();
  }

  /** Restaure l'état d'avant l'action, en gardant l'onglet ouvert depuis. */
  function annuler() {
    if (!annulable) return;
    const { id, avant } = annulable;
    oublierAnnulable();
    enregistrer(id, { ...avant, onglet: parties.get(id)?.onglet });
    notifier();
  }

  function preferences(): Preferences {
    prefs ??= lire(CLE_PREFS, estPreferences).valeur ?? prefsParDefaut();
    return prefs;
  }

  function modifierPreferences(p: Preferences) {
    prefs = p;
    persister(CLE_PREFS, p);
    notifier();
  }

  /** GEN-07 : stockage et mémoire repartent de zéro. */
  function effacerTout() {
    effacerStockage();
    oublierAnnulable();
    parties.clear();
    prefs = undefined;
    nonEnregistre = false;
    notifier();
  }

  return {
    partie,
    modifier,
    faireAnnulable,
    annuler,
    annulable: () => annulable,
    preferences,
    modifierPreferences,
    effacerTout,
    nonEnregistre: () => nonEnregistre,
    abonner(f: () => void) {
      abonnes.add(f);
      return () => void abonnes.delete(f);
    }
  };
}

export type Magasin = ReturnType<typeof creerMagasin>;
