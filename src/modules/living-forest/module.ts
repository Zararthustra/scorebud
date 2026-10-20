import { definirModule } from '../types';

// Identité seule : calcul (T17), onglet Tour (T18) et règles (T19) à venir.
export default definirModule({
  id: 'living-forest',
  nom: 'Living Forest',
  description: 'Ressources du tour, feux, arbres et lotus.',
  icone: 'M12 3l6 8h-4l5 6H5l5-6H6zM12 17v4',
  route: '/living-forest',
  participants: { genre: 'joueurs', min: 2, max: 4 },
  retirerDerniereSaisie: true,
  brouillonVide: () => null,
  estBrouillon: (v): v is null => v === null,
  ongletsSaisie: [],
  liensRegles: []
});
