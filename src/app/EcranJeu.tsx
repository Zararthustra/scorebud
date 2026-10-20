import { useEffect, useState } from 'react';
import { tableau } from '../core/partie';
import type { ModuleDeJeu } from '../modules/types';
import { Button, BoutonIcone } from '../ui/Button';
import { Icone, type NomIcone } from '../ui/Icone';
import { Sheet } from '../ui/Sheet';
import { Tabs } from '../ui/Tabs';
import { BarreHaut } from './BarreHaut';
import { compter, magasin, mots, useMagasin, usePartie } from './etat';
import { Joueurs } from './Joueurs';
import {
  FinDePartie,
  lancerNouvellePartie,
  OngletScore,
  type Fin
} from './OngletScore';
import { OngletRegles } from './OngletRegles';
import { Reglages } from './Reglages';
import { afficherToast } from './Toasts';
import { useTitre } from './useTitre';

type Feuille = 'menu' | 'joueurs' | 'reglages' | null;

function ElementMenu({
  icone,
  libelle,
  aide,
  surClic
}: {
  icone: NomIcone;
  libelle: string;
  aide: string;
  surClic: () => void;
}) {
  return (
    <li>
      <button type="button" className="sb-menu__element" onClick={surClic}>
        <Icone nom={icone} taille={24} />
        <span className="sb-carte__texte">
          <span className="body-strong">{libelle}</span>
          <span className="small sb-muted">{aide}</span>
        </span>
      </button>
    </li>
  );
}

/** L'écran d'un jeu, identique pour tous les modules (plan technique §6). */
export function EcranJeu({ module }: { module: ModuleDeJeu }) {
  useTitre(module.nom);
  const p = usePartie(module);
  const nonEnregistre = useMagasin(() => magasin.nonEnregistre());
  const [feuille, setFeuille] = useState<Feuille>(null);

  // Jeux récents d'abord dans le catalogue.
  useEffect(() => {
    const prefs = magasin.preferences();
    if (prefs.recents[0] !== module.id)
      magasin.modifierPreferences({
        ...prefs,
        recents: [module.id, ...prefs.recents.filter((id) => id !== module.id)]
      });
  }, [module.id]);

  const changerOnglet = (onglet: string) =>
    magasin.modifier(module, { ...magasin.partie(module), onglet });
  const fin: Fin =
    module.statut && p.saisies.length > 0
      ? module.statut(tableau(p.participants, p.saisies).totaux)
      : null;

  const vues = module.ongletsSaisie.map(({ id, libelle, Vue }) => ({
    id,
    libelle,
    contenu: fin?.terminee ? (
      <FinDePartie module={module} partie={p} fin={fin} />
    ) : (
      <Vue
        partie={p}
        majBrouillon={(brouillon) =>
          magasin.modifier(module, { ...magasin.partie(module), brouillon })
        }
        ajouterSaisie={(points, toast) => {
          const actuelle = magasin.partie(module);
          magasin.modifier(module, {
            ...actuelle,
            saisies: [...actuelle.saisies, { points }],
            brouillon: module.brouillonVide()
          });
          afficherToast({
            type: 'success',
            message: toast.message,
            action: toast.voirScore
              ? {
                  libelle: 'Voir le score',
                  faire: () => changerOnglet('score')
                }
              : undefined
          });
        }}
      />
    )
  }));
  const score = (
    <OngletScore
      module={module}
      partie={p}
      fin={fin}
      ouvrirJoueurs={() => setFeuille('joueurs')}
    />
  );
  const onglets = [
    ...vues,
    { id: 'score', libelle: 'Score', contenu: score },
    {
      id: 'regles',
      libelle: 'Règles',
      contenu: <OngletRegles module={module} />
    }
  ];
  // Un module sans saisie ni règles (compteur générique) affiche directement son tableau (spec 01 §9).
  const sansOnglets =
    !vues.length && !module.Regles && !module.liensRegles.length;
  const onglet = onglets.some((o) => o.id === p.onglet)
    ? p.onglet!
    : onglets[0].id;

  return (
    <>
      <BarreHaut titre={module.nom}>
        <BoutonIcone
          icone="menu"
          aria-label="Menu du jeu"
          onClick={() => setFeuille('menu')}
        />
      </BarreHaut>
      {nonEnregistre && (
        <p className="sb-bandeau" role="status">
          <Icone nom="alerte" />
          Cette partie n’est pas enregistrée sur cet appareil
        </p>
      )}
      <main className="sb-page">
        {sansOnglets ? (
          score
        ) : (
          <Tabs
            libelle={module.nom}
            onglets={onglets}
            valeur={onglet}
            surChangement={changerOnglet}
          />
        )}
      </main>
      <Sheet
        ouvert={feuille === 'menu'}
        surFermeture={() => setFeuille(null)}
        titre={module.nom}>
        <nav aria-label="Menu du jeu">
          <ul className="sb-liste sb-liste--nue">
            <ElementMenu
              icone="joueurs"
              libelle={mots(module).titre}
              aide={compter(p.participants.length, module)}
              surClic={() => setFeuille('joueurs')}
            />
            {p.saisies.length > 0 && (
              <ElementMenu
                icone="reinitialiser"
                libelle="Nouvelle partie"
                aide={`Garde les ${mots(module).plusieurs}, efface les scores`}
                surClic={() => {
                  setFeuille(null);
                  lancerNouvellePartie(module, p);
                }}
              />
            )}
            <ElementMenu
              icone="reglages"
              libelle="Réglages"
              aide="Thème, données, version"
              surClic={() => setFeuille('reglages')}
            />
          </ul>
        </nav>
        <Button bloc onClick={() => setFeuille(null)}>
          Fermer
        </Button>
      </Sheet>
      <Joueurs
        module={module}
        ouvert={feuille === 'joueurs'}
        surFermeture={() => setFeuille(null)}
      />
      <Reglages
        ouvert={feuille === 'reglages'}
        surFermeture={() => setFeuille(null)}
      />
    </>
  );
}
