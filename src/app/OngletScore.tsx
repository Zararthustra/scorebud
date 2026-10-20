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

export type Fin = { terminee: boolean; gagnants: string[] } | null;

export const lancerNouvellePartie = (module: ModuleDeJeu, p: Partie<unknown>) =>
  magasin.faireAnnulable(
    module,
    nouvellePartie(p, module.brouillonVide),
    'Nouvelle partie commencée'
  );

const retirerDerniere = (module: ModuleDeJeu, p: Partie<unknown>) =>
  magasin.faireAnnulable(
    module,
    retirerDerniereSaisie(p),
    'Dernière saisie retirée'
  );

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
        <Button
          variante="ghost"
          taille="compact"
          icone="annuler"
          onClick={() => retirerDerniere(module, partie)}>
          Retirer la dernière saisie
        </Button>
      )}
    </section>
  );
}

/** Onglet « Score » commun (spec 01 §7, §9) : tableau, retrait de la dernière saisie, état vide. */
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
  return (
    <>
      {fin?.terminee && (
        <FinDePartie module={module} partie={partie} fin={fin} />
      )}
      {module.retirerDerniereSaisie &&
        partie.saisies.length > 0 &&
        !fin?.terminee && (
          <Button
            variante="ghost"
            taille="compact"
            icone="annuler"
            className="sb-fin-de-ligne"
            onClick={() => retirerDerniere(module, partie)}>
            Retirer la dernière saisie
          </Button>
        )}
      <ScoreTable
        participants={partie.participants}
        lignes={lignes}
        totaux={totaux}
        surNom={ouvrirJoueurs}
      />
    </>
  );
}
