import { useState, type KeyboardEvent } from 'react';
import { Icone } from './Icone';
import { CHIFFRES, depuisChiffres, versChiffres, type Signe } from './chiffres';

const NOMS = [
  'Centaines de milliers',
  'Dizaines de milliers',
  'Milliers',
  'Centaines',
  'Dizaines',
  'Unités'
].slice(-CHIFFRES);

type Colonne = {
  nom: string;
  valeur: string;
  avant: string;
  apres: string;
  plus: () => void;
  moins: () => void;
  attributs: object;
};

function Roue({
  nom,
  valeur,
  avant,
  apres,
  plus,
  moins,
  attributs,
  signe
}: Colonne & { signe?: boolean }) {
  const clavier = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp') plus();
    else if (e.key === 'ArrowDown') moins();
    else return;
    e.preventDefault();
  };
  return (
    <div className="sb-roue">
      <button
        type="button"
        tabIndex={-1}
        className="sb-roue__fleche"
        aria-label={signe ? 'Changer le signe' : `${nom} : augmenter`}
        onClick={plus}>
        <Icone nom="haut" />
      </button>
      <span className="sb-roue__voisin" aria-hidden="true">
        {avant}
      </span>
      <span
        role="spinbutton"
        tabIndex={0}
        aria-label={nom}
        className="sb-roue__valeur"
        onKeyDown={clavier}
        {...attributs}>
        {valeur}
      </span>
      <span className="sb-roue__voisin" aria-hidden="true">
        {apres}
      </span>
      <button
        type="button"
        tabIndex={-1}
        className="sb-roue__fleche"
        aria-label={signe ? 'Changer le signe' : `${nom} : diminuer`}
        onClick={moins}>
        <Icone nom="bas" />
      </button>
    </div>
  );
}

/**
 * R24 : un entier saisi par molettes « cadenas » (un signe + 6 chiffres), sans inertie, flèches et clavier.
 * L'état local garde le signe choisi même quand la valeur vaut encore 0.
 * Repli prévu si l'ergonomie coince : `<input inputmode="numeric">` + bouton « − » (plan technique §7).
 */
export function Molettes({
  valeur,
  surChangement,
  libelle
}: {
  valeur: number;
  surChangement: (n: number) => void;
  libelle: string;
}) {
  const [etat, setEtat] = useState(() => versChiffres(valeur));
  const changer = (signe: Signe, chiffres: number[]) => {
    setEtat({ signe, chiffres });
    surChangement(depuisChiffres(signe, chiffres));
  };
  const autreSigne: Signe = etat.signe === '+' ? '−' : '+';
  const tourner = (i: number, pas: number) =>
    changer(
      etat.signe,
      etat.chiffres.map((c, j) => (j === i ? (c + pas + 10) % 10 : c))
    );
  return (
    <div
      role="group"
      aria-label={`Score de ${libelle}`}
      className="sb-molettes">
      <Roue
        signe
        nom="Signe"
        valeur={etat.signe}
        avant={autreSigne}
        apres={autreSigne}
        plus={() => changer(autreSigne, etat.chiffres)}
        moins={() => changer(autreSigne, etat.chiffres)}
        attributs={{
          'aria-valuenow': etat.signe === '+' ? 1 : -1,
          'aria-valuemin': -1,
          'aria-valuemax': 1,
          'aria-valuetext': etat.signe === '+' ? 'plus' : 'moins'
        }}
      />
      {etat.chiffres.map((c, i) => (
        <Roue
          key={NOMS[i]}
          nom={NOMS[i]}
          valeur={String(c)}
          avant={String((c + 9) % 10)}
          apres={String((c + 1) % 10)}
          plus={() => tourner(i, 1)}
          moins={() => tourner(i, -1)}
          attributs={{
            'aria-valuenow': c,
            'aria-valuemin': 0,
            'aria-valuemax': 9
          }}
        />
      ))}
    </div>
  );
}
