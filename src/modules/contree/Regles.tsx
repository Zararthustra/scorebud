import { CARTES } from './calcul';

// CON-09 : le barème appliqué (spec 11 §5.1) en langage clair.
const BAREME = [
  [
    'Contrat rempli',
    'La preneuse remplit son contrat si ses cartes, son dix de der et sa belote atteignent la valeur du contrat. L’égalité suffit.'
  ],
  [
    'Sans contre, rempli',
    'La preneuse marque ses points arrondis plus la valeur du contrat. La défense marque ses points arrondis.'
  ],
  [
    'Sans contre, chuté',
    'La preneuse marque 0. La défense marque 160 plus la valeur du contrat.'
  ],
  [
    'Contré ou surcontré',
    'L’équipe gagnante marque 160 plus la valeur du contrat, multipliés par 2 ou par 4. L’autre marque 0.'
  ],
  [
    'Tous les plis',
    'Si une équipe remporte tous les plis sans capot annoncé, 250 remplace 160.'
  ],
  [
    'Capot annoncé',
    '500 à la preneuse si elle fait tous les plis, sinon à la défense. Multiplié par 2 ou 4 si contré ou surcontré.'
  ],
  [
    'Belote',
    'L’équipe qui la détient marque toujours 20 de plus, jamais multipliés.'
  ],
  [
    'Arrondi',
    'À la dizaine la plus proche, 5 vers le haut, pour chaque équipe.'
  ],
  [
    'Fin de partie',
    'Dès qu’une équipe atteint 1000 points avec un total différent de l’autre. À égalité, une donne de départage.'
  ]
];

// CON-08 : valeurs §5.2, plus le 7 et le 8 qui valent 0.
const valeur = (nom: string, atout: boolean) =>
  CARTES.find((c) => c.nom === nom && c.atout === atout)?.points ?? 0;
const RANGS = ['Valet', '9', 'As', '10', 'Roi', 'Dame', '8', '7'];

export function Regles() {
  return (
    <>
      <p className="small sb-muted">
        Ce barème peut différer de la règle officielle.
      </p>
      {BAREME.map(([titre, texte]) => (
        <div key={titre} className="sb-regle">
          <h3 className="h3">{titre}</h3>
          <p>{texte}</p>
        </div>
      ))}
      <h2 className="h2">Valeur des cartes</h2>
      <div className="sb-table-wrap">
        <table className="sb-table">
          <caption className="sb-sr">
            Valeur de chaque carte, à l’atout et hors atout
          </caption>
          <thead>
            <tr>
              <th scope="col">Carte</th>
              <th scope="col">Atout</th>
              <th scope="col">Hors atout</th>
            </tr>
          </thead>
          <tbody>
            {RANGS.map((r) => (
              <tr key={r}>
                <th scope="row" className="sb-table__rang">
                  {r}
                </th>
                <td>{valeur(r, true)}</td>
                <td>{valeur(r, false)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small sb-muted">
        152 points de cartes par donne, 162 avec le dix de der, 182 avec une
        belote.
      </p>
    </>
  );
}
