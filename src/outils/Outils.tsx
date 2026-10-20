import { useEffect, useState } from 'react';
import { afficherToast } from '../app/Toasts';
import { Button, BoutonIcone } from '../ui/Button';
import { Icone } from '../ui/Icone';
import { Sheet } from '../ui/Sheet';
import { vibrer } from '../ui/vibrer';
import { lancer } from './de';
import { ajuster, DUREE_PAR_DEFAUT, formater, restant } from './minuteur';

// Points des 6 faces sur une grille 3 × 3 (maquette Outil-de).
const FACES = [
  [0, 0, 0, 0, 1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 0, 1]
];
// Motif de l'ancienne version : trois impulsions, pause, trois, pause, trois (OUT-04).
const VIBRATION_FIN = [50, 50, 50, 500, 50, 50, 50, 500, 50, 50, 50];

function FeuilleDe({
  ouvert,
  surFermeture
}: {
  ouvert: boolean;
  surFermeture: () => void;
}) {
  const [tirage, setTirage] = useState<{ valeur: number; n: number } | null>(
    null
  );
  return (
    <Sheet ouvert={ouvert} surFermeture={surFermeture} titre="Dé">
      <div className="sb-outil">
        {tirage ? (
          // La clé relance l'animation à chaque tirage ; prefers-reduced-motion la supprime (design system).
          <div
            key={tirage.n}
            role="img"
            aria-label={`Face ${tirage.valeur}`}
            className="sb-de sb-de--lance">
            {FACES[tirage.valeur - 1].map((p, i) => (
              <span key={i} className={p ? 'sb-de__point' : undefined} />
            ))}
          </div>
        ) : (
          <div className="sb-de" aria-hidden="true" />
        )}
        <p className="h1" aria-live="polite">
          {tirage && <>Résultat&nbsp;: {tirage.valeur}</>}
        </p>
      </div>
      <div className="sb-sheet__actions">
        <Button
          variante="primary"
          taille="large"
          bloc
          onClick={() => {
            vibrer();
            setTirage((t) => ({ valeur: lancer(), n: (t?.n ?? 0) + 1 }));
          }}>
          Lancer le dé
        </Button>
        <Button bloc onClick={surFermeture}>
          Fermer
        </Button>
      </div>
    </Sheet>
  );
}

type Minuteur =
  | { mode: 'arret'; duree: number }
  | { mode: 'marche'; duree: number; fin: number }
  | { mode: 'pause'; duree: number; reste: number };

/**
 * Minuteur et dé, outils globaux de la barre du haut (R3). L'état vit dans la barre de l'écran :
 * changer d'écran la démonte et arrête le minuteur (R25).
 */
export function Outils() {
  const [feuille, setFeuille] = useState<'de' | 'minuteur' | null>(null);
  const [m, setM] = useState<Minuteur>({
    mode: 'arret',
    duree: DUREE_PAR_DEFAUT
  });
  const [maintenant, setMaintenant] = useState(Date.now);
  const [annonce, setAnnonce] = useState('');

  const affiche =
    m.mode === 'marche'
      ? restant(m.fin, maintenant)
      : m.mode === 'pause'
        ? m.reste
        : m.duree;

  useEffect(() => {
    if (m.mode !== 'marche') return;
    const id = setInterval(() => setMaintenant(Date.now()), 250);
    return () => clearInterval(id);
  }, [m.mode]);

  useEffect(() => {
    if (m.mode !== 'marche' || affiche > 0) return;
    vibrer(VIBRATION_FIN);
    afficherToast({ type: 'info', message: 'Temps écoulé' });
    setAnnonce('');
    setM({ mode: 'arret', duree: m.duree }); // OUT-04 : retour à la durée choisie
  }, [m, affiche]);

  const demarrer = () => {
    const now = Date.now();
    setMaintenant(now);
    setM({
      mode: 'marche',
      duree: m.duree,
      fin: now + (m.mode === 'pause' ? m.reste : m.duree)
    });
    setAnnonce('Minuteur démarré');
  };
  const pause = () => {
    setM({
      mode: 'pause',
      duree: m.duree,
      reste: restant((m as { fin: number }).fin, Date.now())
    });
    setAnnonce('Minuteur en pause');
  };
  const regler = (sens: 1 | -1) =>
    setM(
      m.mode === 'pause'
        ? { ...m, reste: ajuster(m.reste, sens) }
        : { mode: 'arret', duree: ajuster(m.duree, sens) }
    );

  return (
    <>
      {m.mode === 'arret' ? (
        <BoutonIcone
          icone="minuteur"
          aria-label="Minuteur"
          onClick={() => setFeuille('minuteur')}
        />
      ) : (
        <Button
          taille="compact"
          className="sb-minuteur-barre"
          aria-label={`Minuteur, ${formater(affiche)} restantes`}
          onClick={() => setFeuille('minuteur')}>
          <Icone nom="minuteur" />
          {formater(affiche)}
        </Button>
      )}
      <BoutonIcone
        icone="de"
        aria-label="Dé"
        onClick={() => setFeuille('de')}
      />

      <FeuilleDe
        ouvert={feuille === 'de'}
        surFermeture={() => setFeuille(null)}
      />
      <Sheet
        ouvert={feuille === 'minuteur'}
        surFermeture={() => setFeuille(null)}
        titre="Minuteur">
        <div className="sb-outil">
          <div role="group" aria-label="Durée" className="sb-counter__row">
            <button
              type="button"
              className="sb-counter__btn"
              aria-label="Retirer 15 secondes"
              hidden={m.mode === 'marche'}
              onClick={() => regler(-1)}>
              <Icone nom="moins" taille={24} />
            </button>
            <output className="score-xl sb-minuteur__valeur">
              {formater(affiche)}
            </output>
            <button
              type="button"
              className="sb-counter__btn"
              aria-label="Ajouter 15 secondes"
              hidden={m.mode === 'marche'}
              onClick={() => regler(1)}>
              <Icone nom="plus" taille={24} />
            </button>
          </div>
          <p className="small sb-muted sb-centre-texte">
            Par pas de 15 secondes. Le décompte continue si vous fermez cette
            feuille et s’arrête si vous quittez l’écran.
          </p>
          <p className="sb-sr" role="status">
            {annonce}
          </p>
        </div>
        <div className="sb-sheet__actions">
          {m.mode === 'marche' ? (
            <Button
              variante="primary"
              taille="large"
              bloc
              aria-label="Mettre en pause"
              onClick={pause}>
              Pause
            </Button>
          ) : (
            <Button
              variante="primary"
              taille="large"
              bloc
              aria-label={`${m.mode === 'pause' ? 'Reprendre' : 'Démarrer'} le minuteur`}
              onClick={demarrer}>
              {m.mode === 'pause' ? 'Reprendre' : 'Démarrer'}
            </Button>
          )}
          <Button bloc onClick={() => setFeuille(null)}>
            Fermer
          </Button>
        </div>
      </Sheet>
    </>
  );
}
