import { useId, useState } from 'react';
import { Button, BoutonIcone } from '../../ui/Button';
import { Icone } from '../../ui/Icone';
import { NomJoueur } from '../../ui/ScoreTable';
import { Tabs } from '../../ui/Tabs';
import { vibrer } from '../../ui/vibrer';
import type { PropsSaisie } from '../types';
import {
  borne,
  diminuerAjustement,
  lotusVictoire,
  RESSOURCES,
  ressourcesVides,
  totalJoueur,
  totauxRessources,
  type PointsJoueur,
  type Ressource,
  type Ressources
} from './calcul';
import deplacement from './icones/move.png';
import eau from './icones/drop.png';
import feu from './icones/fire.png';
import kodama from './icones/kodama.png';
import lotus from './icones/lotus.png';
import lotusBlanc from './icones/lotus-white.png';
import plante from './icones/plant.png';
import soleil from './icones/sun.png';
import arbre from './icones/tree.png';

export type Brouillon = {
  ressources: { cartes: Ressources; arbres: Ressources };
  ongletRessources: 'cartes' | 'arbres';
  victoire: { arbre: number; feu: number; ajustementLotus: number };
  parJoueur: Record<string, PointsJoueur>;
  joueurActif: string | null;
};

export const brouillonVide = (): Brouillon => ({
  ressources: { cartes: ressourcesVides(), arbres: ressourcesVides() },
  ongletRessources: 'cartes',
  victoire: { arbre: 0, feu: 0, ajustementLotus: 0 },
  parJoueur: {},
  joueurActif: null
});

// R17 : les icônes de l'ancienne version, nom lu par les lecteurs d'écran (« Ajouter une plante »).
const NOMS: Record<
  Ressource,
  { libelle: string; article: string; icone: string }
> = {
  plante: { libelle: 'Plante', article: 'une plante', icone: plante },
  soleil: { libelle: 'Soleil', article: 'un soleil', icone: soleil },
  eau: { libelle: 'Eau', article: 'de l’eau', icone: eau },
  deplacement: {
    libelle: 'Déplacement',
    article: 'un déplacement',
    icone: deplacement
  },
  lotus: { libelle: 'Lotus', article: 'un lotus', icone: lotusBlanc },
  kodama: { libelle: 'Kodama', article: 'un kodama', icone: kodama }
};
const VICTOIRE = {
  arbre: { libelle: 'Arbres', article: 'un arbre', icone: arbre },
  feu: { libelle: 'Feux', article: 'un feu', icone: feu },
  lotus: { libelle: 'Lotus', article: 'un lotus', icone: lotus }
};

const toutAZero = (o: Record<string, number>) =>
  Object.values(o).every((v) => v === 0);

/** Une ligne : icône, libellé, −, valeur annoncée, + (README Counter : chiffre en score-m à côté d'une icône). */
function Compteur({
  libelle,
  article,
  icone,
  valeur,
  aide,
  surPlus,
  surMoins
}: {
  libelle: string;
  article: string;
  icone: string;
  valeur: number;
  aide?: string;
  surPlus: () => void;
  surMoins: () => void;
}) {
  const appui = (f: () => void) => () => {
    vibrer();
    f();
  };
  return (
    <div role="group" aria-label={libelle} className="sb-ligne-compteur">
      <img src={icone} alt="" className="sb-ligne-compteur__icone" />
      <span className="sb-ligne-compteur__libelle">
        <span className="small sb-muted">{libelle}</span>
        {aide && <span className="caption sb-muted">{aide}</span>}
      </span>
      <button
        type="button"
        className="sb-counter__btn sb-counter__btn--m"
        aria-label={`Retirer ${article}`}
        onClick={appui(surMoins)}>
        <Icone nom="moins" taille={22} />
      </button>
      <output className="score-m sb-ligne-compteur__valeur" aria-live="polite">
        {valeur}
      </output>
      <button
        type="button"
        className="sb-counter__btn sb-counter__btn--m"
        aria-label={`Ajouter ${article}`}
        onClick={appui(surPlus)}>
        <Icone nom="plus" taille={22} />
      </button>
    </div>
  );
}

function Zone({
  titre,
  action,
  children
}: {
  titre: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const id = useId();
  return (
    <section className="sb-zone" aria-labelledby={id}>
      <div className="sb-entete-section">
        <h2 id={id} className="h3">
          {titre}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Onglet Tour (spec 12 §2) : aide-mémoire de ressources (A), totaux et conditions de victoire (B), points par joueur (C). */
export function OngletTour({
  partie,
  majBrouillon,
  ajouterSaisie
}: PropsSaisie<Brouillon>) {
  const [message, setMessage] = useState<string>();
  const b = partie.brouillon;
  const maj = (x: Partial<Brouillon>, annulable?: string) =>
    majBrouillon({ ...b, ...x }, annulable);
  const { cartes, arbres } = b.ressources;
  const origine = b.ongletRessources;
  const totaux = totauxRessources(cartes, arbres);
  const lotusTotal = lotusVictoire(cartes, arbres, b.victoire.ajustementLotus);

  const changerRessource = (
    o: 'cartes' | 'arbres',
    r: Ressource,
    pas: number
  ) =>
    maj({
      ressources: {
        ...b.ressources,
        [o]: { ...b.ressources[o], [r]: borne(b.ressources[o][r] + pas) }
      }
    });

  const panneauRessources = (o: 'cartes' | 'arbres') => (
    <div>
      {RESSOURCES.map((r) => (
        <Compteur
          key={r}
          {...NOMS[r]}
          valeur={b.ressources[o][r]}
          surPlus={() => changerRessource(o, r, 1)}
          surMoins={() => changerRessource(o, r, -1)}
        />
      ))}
    </div>
  );

  const nomOrigine = origine === 'cartes' ? 'Cartes' : 'Arbres';
  const v = b.victoire;
  const joueurs = partie.participants;
  const actif = joueurs.find((j) => j.id === b.joueurActif) ?? joueurs[0];

  const panneauJoueur = (id: string, nom: string) => {
    const p = b.parJoueur[id] ?? { arbre: 0, feu: 0, lotus: 0 };
    const changer = (k: keyof PointsJoueur, pas: number) => {
      setMessage(undefined);
      maj({
        parJoueur: { ...b.parJoueur, [id]: { ...p, [k]: borne(p[k] + pas) } }
      });
    };
    const total = totalJoueur(p);
    const manche = partie.saisies.filter((s) => id in s.points).length + 1;
    const ajouter = () => {
      if (total === 0) return setMessage('Aucun point à ajouter');
      ajouterSaisie(
        { [id]: total },
        { message: `${total} points ajoutés pour ${nom}`, voirScore: true }
      );
      // L'ajout vide le brouillon : seuls les compteurs de ce joueur repartent de 0 (LF-03, E3).
      majBrouillon({
        ...b,
        parJoueur: { ...b.parJoueur, [id]: { arbre: 0, feu: 0, lotus: 0 } }
      });
    };
    return (
      <>
        <div>
          {(['arbre', 'feu', 'lotus'] as const).map((k) => (
            <Compteur
              key={k}
              {...VICTOIRE[k]}
              valeur={p[k]}
              surPlus={() => changer(k, 1)}
              surMoins={() => changer(k, -1)}
            />
          ))}
        </div>
        <Button
          variante="primary"
          taille="large"
          bloc
          icone="plus"
          onClick={ajouter}>
          Ajouter {total} pour la manche {manche}
        </Button>
        {message && (
          <p className="small" role="status">
            {message}
          </p>
        )}
      </>
    );
  };

  return (
    <>
      <Zone
        titre="Ressources du tour"
        action={
          <BoutonIcone
            icone="reinitialiser"
            aria-label={`Remettre à zéro les ressources ${nomOrigine}`}
            onClick={() =>
              !toutAZero(b.ressources[origine]) &&
              maj(
                {
                  ressources: { ...b.ressources, [origine]: ressourcesVides() }
                },
                `Ressources ${nomOrigine} remises à zéro`
              )
            }
          />
        }>
        <Tabs
          libelle="Origine des ressources"
          valeur={origine}
          surChangement={(o) =>
            maj({ ongletRessources: o as 'cartes' | 'arbres' })
          }
          onglets={[
            {
              id: 'cartes',
              libelle: 'Cartes',
              contenu: panneauRessources('cartes')
            },
            {
              id: 'arbres',
              libelle: 'Arbres',
              contenu: panneauRessources('arbres')
            }
          ]}
        />
      </Zone>

      <section className="sb-stack sb-stack--serre" aria-labelledby="lf-totaux">
        <h2 id="lf-totaux" className="h3">
          Totaux <span className="small sb-muted">cartes + arbres</span>
        </h2>
        <dl className="sb-totaux-ressources">
          {RESSOURCES.filter((r) => r !== 'lotus').map((r) => (
            <div key={r}>
              <dt>
                <img src={NOMS[r].icone} alt={NOMS[r].libelle} />
              </dt>
              <dd className="score-m">{totaux[r]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Zone
        titre="Conditions de victoire"
        action={
          <BoutonIcone
            icone="reinitialiser"
            aria-label="Remettre à zéro arbres, feux et ajustement des lotus"
            onClick={() =>
              !toutAZero(v) &&
              maj(
                { victoire: { arbre: 0, feu: 0, ajustementLotus: 0 } },
                'Conditions de victoire remises à zéro'
              )
            }
          />
        }>
        <div>
          <Compteur
            {...VICTOIRE.arbre}
            valeur={v.arbre}
            surPlus={() => maj({ victoire: { ...v, arbre: v.arbre + 1 } })}
            surMoins={() =>
              maj({ victoire: { ...v, arbre: borne(v.arbre - 1) } })
            }
          />
          <Compteur
            {...VICTOIRE.feu}
            valeur={v.feu}
            surPlus={() => maj({ victoire: { ...v, feu: v.feu + 1 } })}
            surMoins={() => maj({ victoire: { ...v, feu: borne(v.feu - 1) } })}
          />
          <Compteur
            {...VICTOIRE.lotus}
            valeur={lotusTotal}
            aide={`${cartes.lotus} des cartes + ${arbres.lotus} des arbres${v.ajustementLotus ? ` ${v.ajustementLotus > 0 ? '+' : '−'} ${Math.abs(v.ajustementLotus)} ajusté` : ''}`}
            surPlus={() =>
              maj({
                victoire: { ...v, ajustementLotus: v.ajustementLotus + 1 }
              })
            }
            surMoins={() =>
              maj({
                victoire: {
                  ...v,
                  ajustementLotus: diminuerAjustement(
                    cartes,
                    arbres,
                    v.ajustementLotus
                  )
                }
              })
            }
          />
        </div>
      </Zone>

      <Zone titre="Points du joueur">
        {joueurs.length < 2 ? (
          <p className="small sb-muted">
            Ajoutez 2 à 4 joueurs pour enregistrer des points
          </p>
        ) : (
          <Tabs
            libelle="Joueurs"
            valeur={actif.id}
            surChangement={(joueurActif) => {
              setMessage(undefined);
              maj({ joueurActif });
            }}
            onglets={joueurs.map((j, i) => ({
              id: j.id,
              libelle: <NomJoueur nom={j.nom} rang={i} />,
              contenu: panneauJoueur(j.id, j.nom)
            }))}
          />
        )}
      </Zone>
    </>
  );
}
