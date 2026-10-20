import { useId, useState } from 'react';
import { tableau, type Participant } from '../../core/partie';
import { Button } from '../../ui/Button';
import { ChoiceChips } from '../../ui/ChoiceChips';
import { Icone } from '../../ui/Icone';
import { formaterPoints, NomJoueur } from '../../ui/ScoreTable';
import { Switch } from '../../ui/Switch';
import type { PropsSaisie } from '../types';
import {
  calculerDonne,
  CARTES,
  contratRempli,
  CONTRATS,
  peutCliquer,
  pointsDesClics,
  SEUIL,
  versEntree,
  type Atout,
  type CarteId,
  type Contrat,
  type EntreeDonne,
  type Reglage
} from './calcul';

export type Brouillon = {
  etape: 1 | 2 | 3;
  reglage: Reglage;
  equipeComptee: string | null;
  clics: CarteId[];
  tousLesPlis: string | null; // id de l'équipe qui a fait tous les plis, null = non
};

export const ATOUTS: { valeur: Atout; nom: string; symbole: string }[] = [
  { valeur: 'trefle', nom: 'Trèfle', symbole: '♣︎' },
  { valeur: 'coeur', nom: 'Cœur', symbole: '♥︎' },
  { valeur: 'pique', nom: 'Pique', symbole: '♠︎' },
  { valeur: 'carreau', nom: 'Carreau', symbole: '♦︎' }
];

// Article et accord pour les messages de refus (« La dame hors atout est déjà comptée 3 fois. »).
const ARTICLE: Record<string, string> = {
  Valet: 'Le valet',
  '9': 'Le 9',
  As: 'L’as',
  '10': 'Le 10',
  Roi: 'Le roi',
  Dame: 'La dame'
};

type Props = PropsSaisie<Brouillon>;
type Maj = (x: Partial<Brouillon>, annulable?: string) => void;

function Etapes({ etape }: { etape: number }) {
  return (
    <ol className="sb-etapes" aria-label="Étapes de la donne">
      {['Régler', 'Compter', 'Résultat'].map((nom, i) => (
        <li
          key={nom}
          aria-current={etape === i + 1 ? 'step' : undefined}
          className={etape > i + 1 ? 'sb-etapes--faite' : undefined}>
          <span className="sb-etapes__pastille" aria-hidden="true">
            {etape > i + 1 ? <Icone nom="coche" taille={14} /> : i + 1}
          </span>
          {nom}
        </li>
      ))}
    </ol>
  );
}

function Totaux({
  equipes,
  totaux,
  donne
}: {
  equipes: Participant[];
  totaux: Record<string, number>;
  donne: number;
}) {
  return (
    <section className="sb-totaux" aria-label="Totaux de la partie">
      {equipes.map((e, i) => (
        <div key={e.id} className="sb-totaux__equipe">
          <NomJoueur nom={e.nom} rang={i} />
          <span className="h1 sb-nombre">{formaterPoints(totaux[e.id])}</span>
        </div>
      ))}
      <p className="small sb-muted sb-totaux__note">
        Première équipe à {SEUIL} points. Donne {donne}.
      </p>
    </section>
  );
}

function EtapeReglage({
  b,
  maj,
  equipes
}: {
  b: Brouillon;
  maj: Maj;
  equipes: Participant[];
}) {
  const idContrat = useId();
  const [erreur, setErreur] = useState<string>();
  const r = b.reglage;
  const regler = (x: Partial<Reglage>) => {
    setErreur(undefined);
    maj({ reglage: { ...r, ...x } });
  };
  const equipesOptions = equipes.map((e) => ({ valeur: e.id, libelle: e.nom }));
  const nomComptee = equipes.find((e) => e.id === b.equipeComptee)?.nom;

  const compter = (e: Participant) => {
    const entree = versEntree(
      r,
      equipes.map((x) => x.id)
    );
    if ('erreur' in entree) return setErreur(entree.erreur);
    const memeEquipe = e.id === b.equipeComptee;
    maj(
      { etape: 2, equipeComptee: e.id, clics: memeEquipe ? b.clics : [] },
      !memeEquipe && b.clics.length
        ? `Comptage de ${nomComptee} effacé`
        : undefined
    );
  };

  return (
    <>
      <section className="sb-carte-section" aria-labelledby={`${idContrat}-t`}>
        <h2 id={`${idContrat}-t`} className="h2">
          Régler la donne
        </h2>
        <ChoiceChips
          titre="Équipe preneuse"
          options={equipesOptions}
          valeur={r.preneuse}
          surChangement={(preneuse) => regler({ preneuse })}
        />
        <ChoiceChips<Atout>
          titre="Atout"
          valeur={r.atout}
          surChangement={(atout) => regler({ atout })}
          options={ATOUTS.map((a) => ({
            valeur: a.valeur,
            nomAccessible: a.nom,
            libelle: (
              <span className="sb-opt__suit" aria-hidden="true">
                {a.symbole}
              </span>
            )
          }))}
        />
        <div className="sb-field sb-field--large">
          <label className="sb-field__label h3" htmlFor={idContrat}>
            Contrat
          </label>
          <select
            id={idContrat}
            className="sb-field__input sb-select"
            value={r.contrat ?? ''}
            onChange={(e) =>
              regler({
                contrat:
                  e.target.value === ''
                    ? null
                    : ((e.target.value === 'capot'
                        ? 'capot'
                        : Number(e.target.value)) as Contrat)
              })
            }>
            <option value="">Choisir le contrat</option>
            {CONTRATS.map((c) => (
              <option key={c} value={c}>
                {c === 'capot' ? 'Capot' : c}
              </option>
            ))}
          </select>
        </div>
        <div className="sb-option-dependante">
          <Switch
            libelle="Belote / Rebelote"
            actif={r.belote}
            surChangement={(belote) =>
              regler({ belote, equipeBelote: belote ? r.equipeBelote : null })
            }
          />
          {r.belote && (
            <div className="sb-sous-options">
              <ChoiceChips
                titre="Équipe qui la détient"
                options={equipesOptions}
                valeur={r.equipeBelote}
                surChangement={(equipeBelote) => regler({ equipeBelote })}
              />
            </div>
          )}
        </div>
        <div className="sb-option-dependante">
          <Switch
            libelle="Contré"
            actif={r.contre}
            surChangement={(contre) =>
              regler({ contre, surcontre: contre && r.surcontre })
            }
          />
          {r.contre && (
            <div className="sb-sous-options">
              <Switch
                libelle="Surcontré"
                actif={r.surcontre}
                surChangement={(surcontre) => regler({ surcontre })}
              />
            </div>
          )}
        </div>
        {r.contrat !== 'capot' && (
          <div className="sb-option-dependante">
            <ChoiceChips
              titre="Dix de der"
              options={equipesOptions}
              valeur={r.dernierPli}
              surChangement={(dernierPli) => regler({ dernierPli })}
            />
            <p className="small sb-muted">Équipe qui remporte le dernier pli</p>
          </div>
        )}
      </section>
      <section
        className="sb-stack sb-stack--serre"
        aria-label="Compter les cartes">
        <h2 className="h3">Compter les cartes de</h2>
        <div className="sb-grille-2">
          {equipes.map((e) => (
            <Button key={e.id} taille="large" onClick={() => compter(e)}>
              Compter {e.nom}
            </Button>
          ))}
        </div>
        {erreur ? (
          <p className="sb-field__msg sb-field__msg--error small" role="alert">
            <Icone nom="alerte" taille={16} />
            {erreur}
          </p>
        ) : (
          <p className="small sb-muted">
            Le résultat est le même quelle que soit l’équipe comptée.
          </p>
        )}
      </section>
    </>
  );
}

function EtatContrat({ rempli }: { rempli: boolean }) {
  return (
    <span className={rempli ? 'sb-etat sb-etat--rempli' : 'sb-etat'}>
      <Icone nom={rempli ? 'succes' : 'alerte'} />
      {rempli ? 'Contrat rempli' : 'Contrat chuté'}
    </span>
  );
}

function resume(r: Reglage, nom: (id: string | null) => string | undefined) {
  const atout = ATOUTS.find((a) => a.valeur === r.atout);
  const parts = [
    `${nom(r.preneuse)} prend à ${r.contrat === 'capot' ? 'capot' : r.contrat}, atout ${atout?.nom.toLowerCase()}${r.surcontre ? ', surcontré' : r.contre ? ', contré' : ''}.`,
    r.belote ? `Belote : ${nom(r.equipeBelote)}.` : '',
    r.contrat !== 'capot' ? `Dix de der : ${nom(r.dernierPli)}.` : ''
  ];
  return parts.filter(Boolean).join(' ');
}

function EtapeComptage({
  b,
  maj,
  equipes,
  entree
}: {
  b: Brouillon;
  maj: Maj;
  equipes: Participant[];
  entree: EntreeDonne;
}) {
  const [message, setMessage] = useState<string>();
  const nom = (id: string | null) => equipes.find((e) => e.id === id)?.nom;
  const comptee = equipes.find((e) => e.id === b.equipeComptee)!;
  const autre = equipes.find((e) => e.id !== b.equipeComptee)!;
  const capot = entree.contrat === 'capot';
  const cartesVisibles = !capot && b.tousLesPlis === null;
  const lettre = entree.cartes.equipe;

  const cliquer = (c: (typeof CARTES)[number]) => {
    if (!peutCliquer(b.clics, c.id)) {
      const article = ARTICLE[c.nom];
      const accord = c.nom === 'Dame' ? 'e' : '';
      return setMessage(
        c.atout
          ? `${article} d’atout est déjà compté${accord}.`
          : `${article} hors atout est déjà compté${accord} 3 fois.`
      );
    }
    setMessage(undefined);
    maj({ clics: [...b.clics, c.id] });
  };

  const cartes = pointsDesClics(b.clics);
  const dixDeDer = entree.dernierPli === lettre ? 10 : 0;
  const belote = entree.belote === lettre ? 20 : 0;
  const detail = [
    `Cartes ${cartes}`,
    dixDeDer && 'dix de der 10',
    belote && 'belote 20'
  ]
    .filter(Boolean)
    .join(' + ');

  return (
    <>
      <div className="sb-resume">
        <p className="small sb-muted">{resume(b.reglage, nom)}</p>
        <Button
          variante="ghost"
          taille="compact"
          onClick={() => maj({ etape: 1 })}>
          Modifier le réglage
        </Button>
      </div>
      {capot ? (
        <ChoiceChips
          titre={`${nom(b.reglage.preneuse)} a-t-elle remporté tous les plis ?`}
          valeur={b.tousLesPlis ? 'oui' : 'non'}
          surChangement={(v) =>
            maj({ tousLesPlis: v === 'oui' ? b.reglage.preneuse : null })
          }
          options={[
            { valeur: 'oui', libelle: 'Oui' },
            { valeur: 'non', libelle: 'Non' }
          ]}
        />
      ) : (
        <>
          <div className="sb-entete-section">
            <h2 className="h2">Cartes de {comptee.nom}</h2>
            <Button
              variante="ghost"
              taille="compact"
              onClick={() =>
                maj(
                  { equipeComptee: autre.id, clics: [] },
                  b.clics.length
                    ? `Comptage de ${comptee.nom} effacé`
                    : undefined
                )
              }>
              Compter {autre.nom}
            </Button>
          </div>
          <ChoiceChips
            titre="Une équipe a-t-elle remporté tous les plis ?"
            valeur={b.tousLesPlis ?? 'non'}
            surChangement={(v) => maj({ tousLesPlis: v === 'non' ? null : v })}
            options={[
              { valeur: 'non', libelle: 'Non' },
              ...equipes.map((e) => ({ valeur: e.id, libelle: e.nom }))
            ]}
          />
        </>
      )}
      {cartesVisibles && (
        <>
          {[true, false].map((atout) => (
            <section
              key={String(atout)}
              className="sb-stack sb-stack--serre"
              aria-label={atout ? 'Atouts' : 'Autres couleurs'}>
              <h3 className="h3">
                {atout ? 'Atouts ' : 'Autres couleurs'}
                {atout && (
                  <span aria-hidden="true">
                    {ATOUTS.find((a) => a.valeur === b.reglage.atout)?.symbole}
                  </span>
                )}
              </h3>
              {!atout && (
                <p className="small sb-muted">
                  Chaque valeur se compte 3 fois au plus. Les 7, 8 et 9 valent
                  0.
                </p>
              )}
              <div className="sb-cartes">
                {CARTES.filter((c) => c.atout === atout).map((c) => {
                  const n = b.clics.filter((x) => x === c.id).length;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className="sb-carte-jeu"
                      data-comptee={n > 0 || undefined}
                      aria-pressed={atout ? n > 0 : undefined}
                      onClick={() => cliquer(c)}>
                      {n > 0 && (
                        <span
                          className="sb-carte-jeu__coche"
                          aria-hidden="true">
                          <Icone nom="coche" taille={14} />
                        </span>
                      )}
                      {/* Nom accessible = texte visible + précisions lues seulement (« Valet d’atout, 20 points, Compté »). */}
                      <span className="label">
                        {c.nom}
                        <span className="sb-sr">
                          {atout ? ' d’atout,' : ' hors atout,'}
                        </span>
                      </span>
                      <span className="h2 sb-nombre">
                        {c.points}
                        <span className="sb-sr"> points,</span>
                      </span>
                      <span className="caption">
                        {atout ? (
                          n ? (
                            'Compté'
                          ) : (
                            'Atout'
                          )
                        ) : (
                          <>
                            <span className="sb-sr">compté </span>
                            {n} sur 3
                          </>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
          <p className="small" role="status">
            {message}
          </p>
          <div className="sb-row sb-row--centre">
            <Button
              variante="ghost"
              taille="compact"
              icone="annuler"
              onClick={() => maj({ clics: b.clics.slice(0, -1) })}>
              Annuler dernier
            </Button>
            <Button
              variante="ghost"
              taille="compact"
              icone="reinitialiser"
              onClick={() =>
                b.clics.length && maj({ clics: [] }, 'Comptage recommencé')
              }>
              Recommencer le comptage
            </Button>
          </div>
        </>
      )}
      <section className="sb-panneau" aria-label={`Total de ${comptee.nom}`}>
        <div className="sb-panneau__ligne">
          {cartesVisibles ? (
            <div className="sb-stack sb-stack--colle">
              <span className="label sb-muted">{comptee.nom}</span>
              <output className="score-l" aria-live="polite">
                {cartes + dixDeDer + belote}
              </output>
            </div>
          ) : (
            <span />
          )}
          <EtatContrat rempli={contratRempli(entree)} />
        </div>
        {cartesVisibles && (
          <p className="small sb-muted">
            {detail}, pour un contrat de {entree.contrat}.
          </p>
        )}
        <Button
          variante="primary"
          taille="large"
          bloc
          onClick={() => maj({ etape: 3 })}>
          Voir le résultat
        </Button>
      </section>
    </>
  );
}

function EtapeResultat({
  b,
  maj,
  equipes,
  entree,
  donne,
  ajouterSaisie
}: {
  b: Brouillon;
  maj: Maj;
  equipes: Participant[];
  entree: EntreeDonne;
  donne: number;
  ajouterSaisie: Props['ajouterSaisie'];
}) {
  const res = calculerDonne(entree);
  const points = { [equipes[0].id]: res.A, [equipes[1].id]: res.B };
  return (
    <section className="sb-carte-section" aria-label="Résultat de la donne">
      <div className="sb-entete-section">
        <h2 className="h2">Donne {donne}</h2>
        <EtatContrat rempli={contratRempli(entree)} />
      </div>
      <div className="sb-grille-2">
        {equipes.map((e, i) => (
          <div key={e.id} className="sb-resultat">
            <NomJoueur nom={e.nom} rang={i} />
            <span className="score-l">{formaterPoints(points[e.id])}</span>
            <span className="caption sb-muted">
              {e.id === b.reglage.preneuse ? 'Preneuse' : 'Défense'}
            </span>
          </div>
        ))}
      </div>
      <Button
        variante="primary"
        taille="large"
        bloc
        onClick={() =>
          ajouterSaisie(points, {
            message: `Donne ${donne} ajoutée`,
            voirScore: true
          })
        }>
        Comptabiliser la manche
      </Button>
      <Button
        variante="ghost"
        taille="compact"
        className="sb-centre"
        onClick={() => maj({ etape: 2 })}>
        Revenir au comptage
      </Button>
    </section>
  );
}

/** Onglet Calcul (spec 11 §3) : régler la donne, compter les cartes d'une équipe, voir le résultat, comptabiliser. */
export function Calcul({ partie, majBrouillon, ajouterSaisie }: Props) {
  const equipes = partie.participants;
  if (equipes.length < 2) {
    const n = 2 - equipes.length;
    return (
      <section className="sb-vide">
        <h2 className="h2">
          Ajoutez encore {n === 1 ? '1 équipe' : `${n} équipes`}
        </h2>
        <p className="sb-muted">
          Les équipes s’ajoutent depuis le menu du jeu ou l’onglet Score.
        </p>
      </section>
    );
  }
  const b = partie.brouillon;
  const maj: Maj = (x, annulable) => majBrouillon({ ...b, ...x }, annulable);
  const { totaux } = tableau(equipes, partie.saisies);
  const donne = partie.saisies.length + 1;
  const reglee = versEntree(
    b.reglage,
    equipes.map((e) => e.id)
  );
  // Un réglage devenu incomplet (rechargement, modification) ramène à l'étape 1.
  const etape =
    'erreur' in reglee || !equipes.some((e) => e.id === b.equipeComptee)
      ? 1
      : b.etape;
  const lettre = (id: string | null) =>
    id === equipes[0].id ? 'A' : id === equipes[1].id ? 'B' : null;
  const entree: EntreeDonne | null =
    'erreur' in reglee
      ? null
      : {
          ...reglee,
          cartes: {
            equipe: lettre(b.equipeComptee) ?? 'A',
            points: pointsDesClics(b.clics)
          },
          tousLesPlis: lettre(b.tousLesPlis)
        };

  return (
    <>
      <Totaux equipes={equipes} totaux={totaux} donne={donne} />
      <Etapes etape={etape} />
      {etape === 1 || !entree ? (
        <EtapeReglage b={b} maj={maj} equipes={equipes} />
      ) : etape === 2 ? (
        <EtapeComptage b={b} maj={maj} equipes={equipes} entree={entree} />
      ) : (
        <EtapeResultat
          b={b}
          maj={maj}
          equipes={equipes}
          entree={entree}
          donne={donne}
          ajouterSaisie={ajouterSaisie}
        />
      )}
    </>
  );
}
