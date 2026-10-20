import type { Ligne, Participant, Points } from '../core/partie';

const nombre = new Intl.NumberFormat('fr-FR');

/** T7 : entiers relatifs, signe moins affiché « − ». */
export const formaterPoints = (n: number) =>
  (n < 0 ? '−' : '') + nombre.format(Math.abs(n));

/** Pastille de couleur et nom : les 12 couleurs se répètent au-delà (R9), le nom est toujours écrit. */
export function NomJoueur({ nom, rang }: { nom: string; rang: number }) {
  return (
    <span className="sb-player">
      <span
        className="sb-dot"
        style={
          { '--c': `var(--player-${(rang % 12) + 1})` } as React.CSSProperties
        }
      />
      {nom}
    </span>
  );
}

type Props = {
  participants: Participant[];
  lignes: Ligne[];
  totaux: Points;
  libelleLigne?: string;
  surNom?: () => void;
};

/** Tableau commun (spec 01 §7) : vrai `<table>`, « – » pour une case vide, meilleur score nommé, défilement dans son conteneur. */
export function ScoreTable({
  participants,
  lignes,
  totaux,
  libelleLigne = 'Manche',
  surNom
}: Props) {
  return (
    <div className="sb-table-wrap">
      <table className="sb-table">
        <caption className="sb-sr">
          Points par {libelleLigne.toLowerCase()}
        </caption>
        <thead>
          <tr>
            <th scope="col">{libelleLigne}</th>
            {participants.map((p, j) => (
              <th scope="col" key={p.id}>
                {surNom ? (
                  <button type="button" className="sb-nom" onClick={surNom}>
                    <NomJoueur nom={p.nom} rang={j} />
                  </button>
                ) : (
                  <NomJoueur nom={p.nom} rang={j} />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lignes.map((l, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              {l.scores.map((s, j) => (
                <td key={participants[j].id}>
                  {s === null ? (
                    <>
                      <span aria-hidden="true">–</span>
                      <span className="sb-sr">pas de score</span>
                    </>
                  ) : l.meilleurs.includes(participants[j].id) ? (
                    <span className="sb-best">
                      {formaterPoints(s)}
                      <span className="sb-sr"> (meilleur score)</span>
                    </span>
                  ) : (
                    formaterPoints(s)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            {participants.map((p) => (
              <td key={p.id}>{formaterPoints(totaux[p.id])}</td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
