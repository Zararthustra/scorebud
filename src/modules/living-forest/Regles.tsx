// Ce que fait le compteur (maquette LF-regles) ; la règle du jeu est dans les PDF liés.
const ITEMS = [
  [
    'Ressources du tour',
    'Comptez ce qu’apportent vos cartes et vos arbres. Les totaux additionnent les deux.'
  ],
  [
    'Lotus',
    'Le lotus des conditions de victoire part du total des cartes et des arbres. Ajustez-le avec + et − en regardant vos cartes.'
  ],
  [
    'Points du joueur',
    'Chaque arbre, feu et lotus vaut 1 point. « Ajouter » inscrit la somme dans le score du joueur et remet ses compteurs à 0.'
  ],
  [
    'Fin de partie',
    'ScoreBud ne détecte pas la fin de partie : à vous de la constater selon la règle.'
  ]
];

export function Regles() {
  return ITEMS.map(([titre, texte]) => (
    <div key={titre} className="sb-regle">
      <h3 className="h3">{titre}</h3>
      <p>{texte}</p>
    </div>
  ));
}
