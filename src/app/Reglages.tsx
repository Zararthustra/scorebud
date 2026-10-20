import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { Theme } from '../core/magasin';
import { modules } from '../modules';
import { Button } from '../ui/Button';
import { ChoiceChips } from '../ui/ChoiceChips';
import { Dialog, Sheet } from '../ui/Sheet';
import { appliquerTheme, magasin, useMagasin } from './etat';
import { afficherToast } from './Toasts';

const liste = (noms: string[]) =>
  noms.slice(0, -1).join(', ') + ' et ' + noms.at(-1);

/** Réglages (R7) : thème, effacer toutes les données (T2), version. */
export function Reglages({
  ouvert,
  surFermeture
}: {
  ouvert: boolean;
  surFermeture: () => void;
}) {
  const prefs = useMagasin(() => magasin.preferences());
  const [confirmer, setConfirmer] = useState(false);
  const naviguer = useNavigate();

  const choisirTheme = (theme: Theme) => {
    magasin.modifierPreferences({ ...prefs, theme });
    appliquerTheme(theme);
  };

  const effacer = () => {
    magasin.effacerTout();
    appliquerTheme('systeme');
    setConfirmer(false);
    surFermeture();
    naviguer('/');
    afficherToast({
      type: 'success',
      message: 'Toutes les données ont été effacées de cet appareil.'
    });
  };

  return (
    <>
      <Sheet
        ouvert={ouvert && !confirmer}
        surFermeture={surFermeture}
        titre="Réglages">
        <div className="sb-stack sb-stack--serre">
          <ChoiceChips<Theme>
            titre="Thème"
            valeur={prefs.theme}
            surChangement={choisirTheme}
            options={[
              { valeur: 'systeme', libelle: 'Système' },
              { valeur: 'clair', libelle: 'Clair' },
              { valeur: 'sombre', libelle: 'Sombre' }
            ]}
          />
          <p className="small sb-muted">
            «&nbsp;Système&nbsp;» suit le réglage de votre téléphone.
          </p>
        </div>
        <div className="sb-stack sb-stack--serre sb-section">
          <h3 className="h3">Données</h3>
          <p className="small sb-muted">
            Les parties sont enregistrées sur cet appareil uniquement.
          </p>
          <Button
            variante="destructive"
            icone="corbeille"
            className="sb-debut"
            onClick={() => setConfirmer(true)}>
            Effacer toutes les données
          </Button>
        </div>
        <p className="caption sb-muted">ScoreBud · version {APP_VERSION}</p>
        <Button bloc onClick={surFermeture}>
          Fermer
        </Button>
      </Sheet>
      <Dialog
        ouvert={confirmer}
        surFermeture={() => setConfirmer(false)}
        titre="Effacer toutes les données ?"
        description={`Les parties en cours de ${liste(modules.map((m) => m.nom))} seront supprimées de cet appareil, ainsi que le choix du thème. Cette action est définitive.`}>
        <Button bloc onClick={() => setConfirmer(false)}>
          Garder mes données
        </Button>
        <Button variante="destructive" bloc icone="corbeille" onClick={effacer}>
          Effacer les données
        </Button>
      </Dialog>
    </>
  );
}
