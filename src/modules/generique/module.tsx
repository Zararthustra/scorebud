import { useState } from 'react';
import type { Points } from '../../core/partie';
import { Button } from '../../ui/Button';
import { Molettes } from '../../ui/Molettes';
import { formaterPoints, NomJoueur } from '../../ui/ScoreTable';
import { Sheet } from '../../ui/Sheet';
import { definirModule, type PropsSaisie } from '../types';

// Brouillon : les valeurs de la feuille d'ajout ouverte, null quand elle est fermée (MOD-06).
type Brouillon = { valeurs: Points | null };

const estBrouillon = (v: unknown): v is Brouillon => {
  const valeurs = (v as Brouillon)?.valeurs;
  return (
    valeurs === null ||
    (typeof valeurs === 'object' &&
      valeurs !== undefined &&
      Object.values(valeurs).every(Number.isFinite))
  );
};

/** SCO-02 : une manche, un entier relatif par joueur, saisi par molettes ; le joueur actif est déplié. */
function AjouterManche({
  partie,
  majBrouillon,
  ajouterSaisie
}: PropsSaisie<Brouillon>) {
  const [actif, setActif] = useState(0);
  const { participants, saisies } = partie;
  const valeurs = partie.brouillon.valeurs;
  if (participants.length < 2) return null;

  const fermer = () => majBrouillon({ valeurs: null });
  const ouvrir = () => {
    setActif(0);
    majBrouillon({
      valeurs: Object.fromEntries(participants.map((p) => [p.id, 0]))
    });
  };

  return (
    <>
      <Button
        variante="primary"
        taille="large"
        bloc
        icone="plus"
        onClick={ouvrir}>
        Ajouter une manche
      </Button>
      <Sheet
        ouvert={valeurs !== null}
        surFermeture={fermer}
        titre="Ajouter une manche"
        aside={`Manche ${saisies.length + 1}`}>
        {valeurs && (
          <>
            <ul className="sb-liste sb-liste--serree">
              {participants.map((p, i) => {
                const v = valeurs[p.id] ?? 0;
                return i === actif ? (
                  <li key={p.id} className="sb-molettes-carte">
                    <div className="sb-molettes-carte__entete">
                      <NomJoueur nom={p.nom} rang={i} />
                      <output className="h2">{formaterPoints(v)}</output>
                    </div>
                    <Molettes
                      valeur={v}
                      libelle={p.nom}
                      surChangement={(n) =>
                        majBrouillon({ valeurs: { ...valeurs, [p.id]: n } })
                      }
                    />
                  </li>
                ) : (
                  <li key={p.id}>
                    <button
                      type="button"
                      className="sb-joueur-replie"
                      onClick={() => setActif(i)}>
                      <span className="sb-sr">Régler le score de </span>
                      <NomJoueur nom={p.nom} rang={i} />
                      <span className="h3">{formaterPoints(v)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="small sb-muted">
              Faites tourner chaque chiffre, ou utilisez les flèches du clavier.
              Touchez un joueur pour régler son score.
            </p>
            <div className="sb-sheet__actions">
              <Button
                variante="primary"
                taille="large"
                bloc
                onClick={() => ajouterSaisie(valeurs)}>
                Ajouter
              </Button>
              <Button bloc onClick={fermer}>
                Annuler
              </Button>
            </div>
          </>
        )}
      </Sheet>
    </>
  );
}

export default definirModule<Brouillon>({
  id: 'generique',
  nom: 'Scores',
  description:
    'Pour n’importe quel jeu : vous notez les points, le tableau fait les totaux.',
  icone: 'M4 5h16v14H4zM4 10h16M10 5v14',
  route: '/scores',
  participants: { genre: 'joueurs', min: 2 },
  retirerDerniereSaisie: false, // R10 : les cases sont modifiables à la place
  brouillonVide: () => ({ valeurs: null }),
  estBrouillon,
  ongletsSaisie: [
    { id: 'manche', libelle: 'Ajouter une manche', Vue: AjouterManche }
  ],
  liensRegles: []
});
