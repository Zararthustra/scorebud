import type { ReactNode } from 'react';
import { Icone } from './Icone';
import { vibrer } from './vibrer';

type Props = {
  libelle: ReactNode;
  valeur: number;
  nomPlus: string; // « Ajouter un arbre »
  nomMoins: string;
  surPlus: () => void;
  surMoins: () => void; // à la borne, le module ne fait rien : « − » reste actif (README Counter)
  style?: 'score-m' | 'score-l' | 'score-xl';
};

/** Compteur +/− : chaque bouton a un nom précis, la valeur est annoncée à chaque changement. */
export function Counter({
  libelle,
  valeur,
  nomPlus,
  nomMoins,
  surPlus,
  surMoins,
  style = 'score-l'
}: Props) {
  const appui = (f: () => void) => () => {
    vibrer();
    f();
  };
  return (
    <div className="sb-counter">
      <div className="sb-counter__row">
        <button
          type="button"
          className="sb-counter__btn"
          aria-label={nomMoins}
          onClick={appui(surMoins)}>
          <Icone nom="moins" taille={24} />
        </button>
        <span className={`sb-counter__value ${style}`} aria-live="polite">
          {valeur}
        </span>
        <button
          type="button"
          className="sb-counter__btn"
          aria-label={nomPlus}
          onClick={appui(surPlus)}>
          <Icone nom="plus" taille={24} />
        </button>
      </div>
      <span className="sb-counter__label">{libelle}</span>
    </div>
  );
}
