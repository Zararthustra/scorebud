import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { vibrer } from './vibrer';

type Option<T> = { valeur: T; libelle: ReactNode; nomAccessible?: string };

/** Choix exclusif (2 à 6 valeurs) : radiogroup, une seule option dans l'ordre de tabulation, les flèches déplacent le choix. */
export function ChoiceChips<T extends string>({
  titre,
  options,
  valeur,
  surChangement
}: {
  titre: string;
  options: Option<T>[];
  valeur: T | null;
  surChangement: (v: T) => void;
}) {
  const id = useId();
  const groupe = useRef<HTMLDivElement>(null);
  const actif = Math.max(
    0,
    options.findIndex((o) => o.valeur === valeur)
  );
  const choisir = (i: number) => {
    vibrer();
    surChangement(options[i].valeur);
  };
  const clavier = (e: KeyboardEvent) => {
    const pas = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[
      e.key
    ];
    if (!pas) return;
    e.preventDefault();
    const i = (actif + pas + options.length) % options.length;
    choisir(i);
    groupe.current?.querySelectorAll<HTMLElement>('[role=radio]')[i]?.focus();
  };
  return (
    <div className="sb-stack sb-stack--serre">
      <h3 id={id} className="h3">
        {titre}
      </h3>
      <div
        ref={groupe}
        className="sb-opts"
        role="radiogroup"
        aria-labelledby={id}>
        {options.map((o, i) => (
          <button
            key={o.valeur}
            type="button"
            className="sb-opt"
            role="radio"
            aria-checked={o.valeur === valeur}
            aria-label={o.nomAccessible}
            tabIndex={i === actif ? 0 : -1}
            onKeyDown={clavier}
            onClick={() => choisir(i)}>
            {o.libelle}
          </button>
        ))}
      </div>
    </div>
  );
}
