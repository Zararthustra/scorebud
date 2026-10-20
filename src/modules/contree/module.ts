import { definirModule } from '../types';

// Identité seule : calcul (T13), saisie de la donne (T14, T15) et règles (T16) à venir.
export default definirModule({
  id: 'contree',
  nom: 'Belote Contrée',
  description: 'Réglez la donne, comptez les cartes, jusqu’à 1000 points.',
  icone: 'M4 8h10v12H4zM8 4h12v12h-2',
  route: '/belote-contree',
  participants: { genre: 'equipes', min: 2, max: 2 },
  retirerDerniereSaisie: true,
  brouillonVide: () => null,
  estBrouillon: (v): v is null => v === null,
  ongletsSaisie: [],
  liensRegles: []
});
