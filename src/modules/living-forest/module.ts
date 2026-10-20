import { definirModule } from '../types';
import { RESSOURCES } from './calcul';
import { brouillonVide, OngletTour, type Brouillon } from './OngletTour';
import { Regles } from './Regles';

const entier = (v: unknown) => Number.isInteger(v) && (v as number) >= 0;
const estRessources = (v: unknown) =>
  typeof v === 'object' &&
  v !== null &&
  RESSOURCES.every((r) => entier((v as Record<string, unknown>)[r]));

/** Lecture défensive du brouillon stocké (spec 00 §5). */
function estBrouillon(v: unknown): v is Brouillon {
  const b = v as Brouillon;
  return (
    typeof b === 'object' &&
    b !== null &&
    estRessources(b.ressources?.cartes) &&
    estRessources(b.ressources?.arbres) &&
    (b.ongletRessources === 'cartes' || b.ongletRessources === 'arbres') &&
    entier(b.victoire?.arbre) &&
    entier(b.victoire?.feu) &&
    Number.isInteger(b.victoire?.ajustementLotus) &&
    typeof b.parJoueur === 'object' &&
    b.parJoueur !== null &&
    Object.values(b.parJoueur).every(
      (p) => entier(p?.arbre) && entier(p?.feu) && entier(p?.lotus)
    ) &&
    (b.joueurActif === null || typeof b.joueurActif === 'string')
  );
}

// LF-07 : pas de `statut`, donc jamais de fin de partie.
export default definirModule<Brouillon>({
  id: 'living-forest',
  nom: 'Living Forest',
  description: 'Ressources du tour, feux, arbres et lotus.',
  icone: 'M12 3l6 8h-4l5 6H5l5-6H6zM12 17v4',
  route: '/living-forest',
  participants: { genre: 'joueurs', min: 2, max: 4 },
  retirerDerniereSaisie: true,
  vocabulaire: { retirer: 'Retirer le dernier ajout' },
  brouillonVide,
  estBrouillon,
  ongletsSaisie: [{ id: 'tour', libelle: 'Tour', Vue: OngletTour }],
  Regles,
  liensRegles: [
    {
      titre: 'Règle de Living Forest',
      url: 'https://cdn.1j1ju.com/medias/0b/1c/6d-living-forest-regle.pdf'
    },
    {
      titre: 'Règle de l’extension Kodama',
      url: 'https://www.data.ludonaute.fr/Living_Forest_Kodama/Rules/FR_LivingForestKodama_Rules.pdf'
    }
  ]
});
