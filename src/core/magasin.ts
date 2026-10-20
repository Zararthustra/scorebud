import { estPartie, partieVide, type Partie } from './partie';
import { ecrire, lire } from './stockage';

/** Ce que le magasin doit savoir d'un module pour lire sa partie. */
export type DefinitionPartie<B> = {
  id: string;
  brouillonVide: () => B;
  estBrouillon: (v: unknown) => v is B;
};

export const DELAI_ANNULATION = 5000;

const cle = (id: string) => `scorebud:v2:${id}`;

/** Une partie par module, en mémoire et écrite à chaque changement ; annulation T1 en un seul endroit. */
export function creerMagasin() {
  const parties = new Map<string, Partie<unknown>>();
  const abonnes = new Set<() => void>();
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

  function partie<B>(def: DefinitionPartie<B>): Partie<B> {
    if (!parties.has(def.id)) {
      const { valeur } = lire(cle(def.id), (v): v is Partie<B> =>
        estPartie(v, def.estBrouillon)
      );
      parties.set(def.id, valeur ?? partieVide(def.brouillonVide()));
    }
    return parties.get(def.id) as Partie<B>;
  }

  function enregistrer(id: string, p: Partie<unknown>) {
    parties.set(id, p);
    ecrire(cle(id), p);
  }

  /** Une modification de la partie rend définitive l'action annulable en cours sur elle : Annuler ne doit rien effacer de plus récent. */
  function modifier<B>(def: DefinitionPartie<B>, p: Partie<B>) {
    if (annulable?.id === def.id) oublierAnnulable();
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

  function annuler() {
    if (!annulable) return;
    const { id, avant } = annulable;
    oublierAnnulable();
    enregistrer(id, avant);
    notifier();
  }

  return {
    partie,
    modifier,
    faireAnnulable,
    annuler,
    annulable: () => annulable,
    abonner(f: () => void) {
      abonnes.add(f);
      return () => void abonnes.delete(f);
    }
  };
}
