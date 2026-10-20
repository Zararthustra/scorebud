import { useState } from 'react';
import { modifierCase, type Participant, type Partie } from '../core/partie';
import type { ModuleDeJeu } from '../modules/types';
import { Button } from '../ui/Button';
import { Molettes } from '../ui/Molettes';
import { formaterPoints, NomJoueur } from '../ui/ScoreTable';
import { Sheet } from '../ui/Sheet';
import { magasin } from './etat';

export type CaseCible = { ligne: number; participant: Participant };

function Saisie({
  module,
  partie,
  cible,
  surFermeture
}: {
  module: ModuleDeJeu;
  partie: Partie<unknown>;
  cible: CaseCible;
  surFermeture: () => void;
}) {
  const { ligne, participant } = cible;
  const avant = partie.saisies.filter((s) => participant.id in s.points)[ligne]
    .points[participant.id];
  const [valeur, setValeur] = useState(avant);
  const libelle = `${participant.nom}, ${(module.vocabulaire?.ligne ?? 'Manche').toLowerCase()} ${ligne + 1}`;

  const enregistrer = () => {
    surFermeture();
    if (valeur === avant) return;
    magasin.faireAnnulable(
      module,
      {
        ...partie,
        saisies: modifierCase(partie.saisies, ligne, participant.id, valeur)
      },
      `Score de ${participant.nom} modifié`,
      `${module.vocabulaire?.ligne ?? 'Manche'} ${ligne + 1}\u00A0: ${formaterPoints(avant)} devient ${formaterPoints(valeur)}`
    );
  };

  return (
    <>
      <NomJoueur
        nom={libelle.replace(', ', ' · ')}
        rang={partie.participants.indexOf(participant)}
      />
      <div className="sb-molettes-carte">
        <div className="sb-molettes-carte__entete">
          <span className="small sb-muted">
            Avant : {formaterPoints(avant)}
          </span>
          <output className="h2" aria-live="polite">
            {formaterPoints(valeur)}
          </output>
        </div>
        <Molettes valeur={avant} surChangement={setValeur} libelle={libelle} />
      </div>
      <div className="sb-sheet__actions">
        <Button variante="primary" taille="large" bloc onClick={enregistrer}>
          Enregistrer
        </Button>
        <Button bloc onClick={surFermeture}>
          Annuler
        </Button>
      </div>
    </>
  );
}

/** SCO-04 (R10) : la même saisie par molettes que l'ajout, pour une seule case ; Annuler par toast (T1). */
export function ModifierCase({
  module,
  partie,
  cible,
  surFermeture
}: {
  module: ModuleDeJeu;
  partie: Partie<unknown>;
  cible: CaseCible | null;
  surFermeture: () => void;
}) {
  return (
    <Sheet
      ouvert={!!cible}
      surFermeture={surFermeture}
      titre="Modifier un score">
      {cible && (
        <Saisie
          key={`${cible.ligne}-${cible.participant.id}`}
          module={module}
          partie={partie}
          cible={cible}
          surFermeture={surFermeture}
        />
      )}
    </Sheet>
  );
}
