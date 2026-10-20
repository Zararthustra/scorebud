import type { CSSProperties } from 'react';
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
        style={{ '--c': `var(--player-${(rang % 12) + 1})` } as CSSProperties}
      />
      {nom}
    </span>
  );
}

function Case({
  score,
  meilleur,
  nom,
  surClic
}: {
  score: number | null;
  meilleur: boolean;
  nom: string;
  surClic?: () => void;
}) {
  if (score === null)
    return (
      <td>
        <span aria-hidden="true">–</span>
        <span className="sb-sr">pas de score</span>
      </td>
    );
  const contenu = meilleur ? (
    <span className="sb-best">
      {formaterPoints(score)}
      <span className="sb-sr"> (meilleur score)</span>
    </span>
  ) : (
    formaterPoints(score)
  );
  if (!surClic) return <td>{contenu}</td>;
  return (
    <td className="sb-td-case">
      <button
        type="button"
        className="sb-case"
        aria-label={`Modifier le score de ${nom} : ${formaterPoints(score)}${meilleur ? ' (meilleur score)' : ''}`}
        onClick={surClic}>
        {contenu}
      </button>
    </td>
  );
}

type Props = {
  participants: Participant[];
  lignes: Ligne[];
  totaux: Points;
  libelleLigne?: string;
  surNom?: () => void;
  surCase?: (ligne: number, participant: Participant) => void; // R10 : chaque case est un bouton
};

/** Tableau commun (spec 01 §7) : vrai `<table>`, « – » pour une case vide, meilleur score nommé, défilement dans son conteneur. */
export function ScoreTable({
  participants,
  lignes,
  totaux,
  libelleLigne = 'Manche',
  surNom,
  surCase
}: Props) {
  const ligne = libelleLigne.toLowerCase();
  return (
    <div className="sb-table-wrap">
      <table className="sb-table">
        <caption className="sb-sr">Points par {ligne}</caption>
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
                <Case
                  key={participants[j].id}
                  score={s}
                  meilleur={l.meilleurs.includes(participants[j].id)}
                  nom={`${participants[j].nom}, ${ligne} ${i + 1}`}
                  surClic={surCase && (() => surCase(i, participants[j]))}
                />
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
