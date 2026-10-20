import { Icone } from './Icone';
import { vibrer } from './vibrer';

/** Interrupteur : toute la ligne est cliquable (le libellé nomme le bouton), Espace bascule. */
export function Switch({
  libelle,
  actif,
  surChangement
}: {
  libelle: string;
  actif: boolean;
  surChangement: (v: boolean) => void;
}) {
  return (
    <label className="sb-switch-row">
      {libelle}
      <button
        type="button"
        role="switch"
        className="sb-switch"
        aria-checked={actif}
        onClick={() => {
          vibrer();
          surChangement(!actif);
        }}>
        <span className="sb-switch__tick" aria-hidden="true">
          <Icone nom="coche" taille={16} />
        </span>
      </button>
    </label>
  );
}
