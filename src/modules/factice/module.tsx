import { Button } from '../../ui/Button';
import { Field } from '../../ui/Field';
import { definirModule, type PropsSaisie } from '../types';

// Module de test (MOD-01, MOD-07) : compilé seulement avec `vite build --mode e2e`.
type Brouillon = { points: string };

function Saisie({
  partie,
  majBrouillon,
  ajouterSaisie
}: PropsSaisie<Brouillon>) {
  return (
    <div className="sb-stack">
      <Field
        libelle="Points"
        inputMode="numeric"
        value={partie.brouillon.points}
        onChange={(e) => majBrouillon({ points: e.target.value })}
      />
      {partie.participants.map((p) => (
        <Button
          key={p.id}
          onClick={() =>
            ajouterSaisie(
              { [p.id]: Number(partie.brouillon.points) || 0 },
              { message: `Points ajoutés pour ${p.nom}`, voirScore: true }
            )
          }>
          Ajouter à {p.nom}
        </Button>
      ))}
    </div>
  );
}

export default definirModule<Brouillon>({
  id: 'factice',
  nom: 'Jeu factice',
  description: 'Module de test.',
  icone: 'M5 4h14v16H5z',
  route: '/factice',
  participants: { genre: 'joueurs', min: 2, max: 3 },
  retirerDerniereSaisie: true,
  vocabulaire: { ligne: 'Tour', retirer: 'Retirer le dernier tour' },
  brouillonVide: () => ({ points: '' }),
  estBrouillon: (v): v is Brouillon =>
    typeof (v as Brouillon)?.points === 'string',
  ongletsSaisie: [{ id: 'saisie', libelle: 'Saisie', Vue: Saisie }],
  Regles: () => <p>Règle factice : chaque appui ajoute les points saisis.</p>,
  liensRegles: [
    { titre: 'Règle officielle factice', url: 'https://example.com/regle.pdf' }
  ],
  statut: (totaux) => {
    const max = Math.max(...Object.values(totaux));
    return max >= 30
      ? {
          terminee: true,
          gagnants: Object.keys(totaux).filter((id) => totaux[id] === max)
        }
      : { terminee: false, gagnants: [] };
  }
});
