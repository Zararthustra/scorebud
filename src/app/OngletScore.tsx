import { useState } from 'react';
import {
  nouvellePartie,
  retirerDerniereSaisie,
  tableau,
  type Partie
} from '../core/partie';
import type { ModuleDeJeu } from '../modules/types';
import { Button } from '../ui/Button';
import { ScoreTable } from '../ui/ScoreTable';
import logo from '../ui/logo.svg';
import { magasin, mots } from './etat';
import { manquants } from './Joueurs';
import { ModifierCase, type CaseCible } from './ModifierCase';

export type Fin = { terminee: boolean; gagnants: string[] } | null;

export const lancerNouvellePartie = (module: ModuleDeJeu, p: Partie<unknown>) =>
  magasin.faireAnnulable(
    module,
    nouvellePartie(p, module.brouillonVide),
    'Nouvelle partie commencée'
  );

function RetirerDerniere({
  module,
  partie,
  className
}: {
  module: ModuleDeJeu;
  partie: Partie<unknown>;
  className?: string;
}) {
  return (
    <Button
      variante="ghost"
      taille="compact"
      icone="annuler"
      className={className}
      onClick={() =>
        magasin.faireAnnulable(
          module,
          retirerDerniereSaisie(partie),
          'Dernière saisie retirée'
        )
      }>
      {module.vocabulaire?.retirer ?? 'Retirer la dernière saisie'}
    </Button>
  );
}

/** MOD-07 : bandeau de fin, gagnants nommés en texte, saisie impossible. */
export function FinDePartie({
  module,
  partie,
  fin
}: {
  module: ModuleDeJeu;
  partie: Partie<unknown>;
  fin: NonNullable<Fin>;
}) {
  const noms = partie.participants
    .filter((j) => fin.gagnants.includes(j.id))
    .map((j) => j.nom);
  const titre =
    noms.length > 1
      ? `${noms.slice(0, -1).join(', ')} et ${noms.at(-1)} gagnent la partie`
      : `${noms[0]} gagne la partie`;
  return (
    <section className="sb-fin" aria-labelledby="titre-fin">
      <img src={logo} alt="" height={56} />
      <h2 id="titre-fin" className="h1 sb-fin__titre">
        {titre}
      </h2>
      <p className="small sb-muted">
        La partie est terminée&nbsp;: aucun score ne peut plus être ajouté.
      </p>
      <Button
        variante="primary"
        taille="large"
        bloc
        icone="reinitialiser"
        onClick={() => lancerNouvellePartie(module, partie)}>
        Nouvelle partie
      </Button>
      {module.retirerDerniereSaisie && (
        <RetirerDerniere module={module} partie={partie} />
      )}
    </section>
  );
}

/**
 * Onglet « Score » commun (spec 01 §7, §9) : tableau, retrait de la dernière saisie, état vide.
 * Un module sans « Retirer la dernière saisie » a des cases modifiables à la place (R10).
 */
export function OngletScore({
  module,
  partie,
  fin,
  ouvrirJoueurs
}: {
  module: ModuleDeJeu;
  partie: Partie<unknown>;
  fin: Fin;
  ouvrirJoueurs: () => void;
}) {
  const [cible, setCible] = useState<CaseCible | null>(null);
  const m = mots(module);
  const n = partie.participants.length;
  if (n < module.participants.min) {
    return (
      <section className="sb-vide">
        <h2 className="h2">{n === 0 ? m.aucun : manquants(module, n)}</h2>
        <p className="sb-muted">
          Ajoutez au moins {module.participants.min} {m.plusieurs} pour noter
          les points.
        </p>
        <Button
          variante="primary"
          taille="large"
          icone="plus"
          onClick={ouvrirJoueurs}>
          {m.ajouter}
        </Button>
      </section>
    );
  }
  const { lignes, totaux } = tableau(partie.participants, partie.saisies);
  const casesModifiables = !module.retirerDerniereSaisie && lignes.length > 0;
  return (
    <>
      {fin?.terminee && (
        <FinDePartie module={module} partie={partie} fin={fin} />
      )}
      {module.retirerDerniereSaisie &&
        partie.saisies.length > 0 &&
        !fin?.terminee && (
          <RetirerDerniere
            module={module}
            partie={partie}
            className="sb-fin-de-ligne"
          />
        )}
      {casesModifiables && (
        <p className="small sb-muted">
          Touchez une case pour la modifier, un nom pour gérer les {m.plusieurs}
          .
        </p>
      )}
      <ScoreTable
        participants={partie.participants}
        lignes={lignes}
        totaux={totaux}
        libelleLigne={module.vocabulaire?.ligne}
        surNom={ouvrirJoueurs}
        surCase={
          casesModifiables
            ? (ligne, participant) => setCible({ ligne, participant })
            : undefined
        }
      />
      <ModifierCase
        module={module}
        partie={partie}
        cible={cible}
        surFermeture={() => setCible(null)}
      />
    </>
  );
}
