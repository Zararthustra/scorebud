import { useRef, useState, type FormEvent } from 'react';
import { NOM_MAX, validerNom } from '../core/partie';
import type { ModuleDeJeu } from '../modules/types';
import { Button, BoutonIcone } from '../ui/Button';
import { Field } from '../ui/Field';
import { NomJoueur } from '../ui/ScoreTable';
import { Sheet } from '../ui/Sheet';
import { compter, magasin, mots, usePartie } from './etat';

const nouvelId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

/** Phrase « Ajoutez encore n joueurs » sous le minimum, sinon null. */
export const manquants = (m: ModuleDeJeu, n: number) =>
  n < m.participants.min
    ? `Ajoutez encore ${compter(m.participants.min - n, m)}`
    : null;

/** Préparation des participants (MOD-02) : ajout, retrait annulable, verrouillage après la première saisie. */
export function Joueurs({
  module,
  ouvert,
  surFermeture
}: {
  module: ModuleDeJeu;
  ouvert: boolean;
  surFermeture: () => void;
}) {
  const p = usePartie(module);
  const [nom, setNom] = useState('');
  const [erreur, setErreur] = useState<string>();
  const champ = useRef<HTMLInputElement>(null);
  const m = mots(module);
  const verrouille = p.saisies.length > 0;
  const plein =
    module.participants.max !== undefined &&
    p.participants.length >= module.participants.max;

  const ajouter = (e: FormEvent) => {
    e.preventDefault();
    const r = validerNom(nom, p.participants);
    champ.current?.focus();
    if ('erreur' in r) return setErreur(r.erreur);
    magasin.modifier(module, {
      ...p,
      participants: [...p.participants, { id: nouvelId(), nom: r.nom }]
    });
    setNom('');
    setErreur(undefined);
  };

  const changer = (valeur: string) => {
    setNom(valeur);
    // T8 : une fois l'erreur apparue, la validation suit la saisie.
    if (erreur) {
      const r = validerNom(valeur, p.participants);
      setErreur('erreur' in r ? r.erreur : undefined);
    }
  };

  const retirer = (id: string, nomRetire: string) =>
    magasin.faireAnnulable(
      module,
      { ...p, participants: p.participants.filter((j) => j.id !== id) },
      `Vous avez retiré ${nomRetire}.`
    );

  return (
    <Sheet
      ouvert={ouvert}
      surFermeture={surFermeture}
      titre={m.titre}
      aside={compter(p.participants.length, module)}>
      {p.participants.length > 0 && (
        <ul className="sb-liste sb-liste--serree">
          {p.participants.map((j, i) => (
            <li key={j.id} className="sb-ligne-joueur">
              <NomJoueur nom={j.nom} rang={i} />
              {!verrouille && (
                <BoutonIcone
                  icone="fermer"
                  aria-label={`Retirer ${j.nom}`}
                  onClick={() => retirer(j.id, j.nom)}
                />
              )}
            </li>
          ))}
        </ul>
      )}
      {verrouille ? (
        <p className="small sb-muted">
          Pour changer les {m.plusieurs}, lancez une nouvelle partie
        </p>
      ) : plein ? (
        <p className="small sb-muted">Maximum atteint</p>
      ) : (
        <form onSubmit={ajouter} noValidate>
          <Field
            ref={champ}
            libelle="Nom"
            value={nom}
            maxLength={NOM_MAX}
            autoComplete="off"
            enterKeyHint="done"
            erreur={erreur}
            onChange={(e) => changer(e.target.value)}
            apres={
              <Button type="submit" className="sb-fixe">
                Ajouter
              </Button>
            }
          />
        </form>
      )}
      {!verrouille && manquants(module, p.participants.length) && (
        <p className="small">{manquants(module, p.participants.length)}</p>
      )}
      <div className="sb-sheet__actions">
        <Button variante="primary" taille="large" bloc onClick={surFermeture}>
          Terminé
        </Button>
      </div>
    </Sheet>
  );
}
