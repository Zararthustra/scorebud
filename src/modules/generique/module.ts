import { definirModule } from '../types';

// Identité seule : l'ajout de manche et la modification d'une case arrivent en T12.
export default definirModule({
  id: 'generique',
  nom: 'Scores',
  description:
    'Pour n’importe quel jeu : vous notez les points, le tableau fait les totaux.',
  icone: 'M4 5h16v14H4zM4 10h16M10 5v14',
  route: '/scores',
  participants: { genre: 'joueurs', min: 2 },
  retirerDerniereSaisie: false,
  brouillonVide: () => null,
  estBrouillon: (v): v is null => v === null,
  ongletsSaisie: [],
  liensRegles: []
});
