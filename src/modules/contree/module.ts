import { definirModule } from '../types';
import { CARTES, CONTRATS, reglageVide, statut } from './calcul';
import { ATOUTS, Calcul, type Brouillon } from './OngletCalcul';
import { Regles } from './Regles';

const estChaine = (v: unknown) => v === null || typeof v === 'string';

/** Lecture défensive du brouillon stocké (spec 00 §5). */
function estBrouillon(v: unknown): v is Brouillon {
  const b = v as Brouillon;
  const r = b?.reglage;
  return (
    typeof b === 'object' &&
    b !== null &&
    [1, 2, 3].includes(b.etape) &&
    typeof r === 'object' &&
    r !== null &&
    estChaine(r.preneuse) &&
    (r.atout === null || ATOUTS.some((a) => a.valeur === r.atout)) &&
    (r.contrat === null || CONTRATS.includes(r.contrat)) &&
    typeof r.belote === 'boolean' &&
    estChaine(r.equipeBelote) &&
    typeof r.contre === 'boolean' &&
    typeof r.surcontre === 'boolean' &&
    estChaine(r.dernierPli) &&
    estChaine(b.equipeComptee) &&
    estChaine(b.tousLesPlis) &&
    Array.isArray(b.clics) &&
    b.clics.every((c) => CARTES.some((x) => x.id === c))
  );
}

export default definirModule<Brouillon>({
  id: 'contree',
  nom: 'Belote Contrée',
  description: 'Réglez la donne, comptez les cartes, jusqu’à 1000 points.',
  icone: 'M4 8h10v12H4zM8 4h12v12h-2',
  route: '/belote-contree',
  participants: { genre: 'equipes', min: 2, max: 2 },
  retirerDerniereSaisie: true,
  vocabulaire: { ligne: 'Donne', retirer: 'Retirer la dernière donne' },
  brouillonVide: () => ({
    etape: 1,
    reglage: reglageVide(),
    equipeComptee: null,
    clics: [],
    tousLesPlis: null
  }),
  estBrouillon,
  ongletsSaisie: [{ id: 'calcul', libelle: 'Calcul', Vue: Calcul }],
  Regles,
  liensRegles: [
    {
      titre: 'Règle officielle de la Belote Contrée',
      url: 'https://www.ffbelote.org/wp-content/uploads/2015/11/REGLES-DE-LA-BELOTE-CONTREE.pdf'
    }
  ],
  statut
});
