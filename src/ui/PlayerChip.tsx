import { Icone } from './Icone';
import { vibrer } from './vibrer';

/** Puce de joueur ou d'équipe sélectionnable : la sélection se voit au fond, au contour et à la coche, pas à la couleur seule. */
export function PlayerChip({
  nom,
  rang,
  choisi,
  surChoix
}: {
  nom: string;
  rang: number;
  choisi: boolean;
  surChoix: () => void;
}) {
  return (
    <button
      type="button"
      className="sb-chip"
      aria-pressed={choisi}
      onClick={() => {
        vibrer();
        surChoix();
      }}>
      <span
        className="sb-dot"
        style={
          { '--c': `var(--player-${(rang % 12) + 1})` } as React.CSSProperties
        }
      />
      {nom}
      <span className="sb-chip__check">
        <Icone nom="coche" taille={16} />
      </span>
    </button>
  );
}
