import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '../ui/Button';
import { Icone } from '../ui/Icone';
import { afficherToast } from './Toasts';

/**
 * Spec 00 §8 : « Prêt pour une utilisation hors ligne » une seule fois, puis un bandeau non bloquant
 * quand une nouvelle version attend. Rien ne recharge sans appui sur « Mettre à jour » (GEN-05).
 */
export function MiseAJour() {
  const {
    needRefresh: [nouvelleVersion, setNouvelleVersion],
    updateServiceWorker
  } = useRegisterSW({
    onOfflineReady: () =>
      afficherToast({
        type: 'info',
        message: 'Prêt pour une utilisation hors ligne'
      })
  });
  if (!nouvelleVersion) return null;
  return (
    <div className="sb-mise-a-jour" role="status">
      <Icone nom="info" />
      <span className="sb-mise-a-jour__texte">Nouvelle version disponible</span>
      <Button
        variante="primary"
        taille="compact"
        onClick={() => updateServiceWorker(true)}>
        Mettre à jour
      </Button>
      <Button
        variante="ghost"
        taille="compact"
        className="sb-btn-icone"
        aria-label="Plus tard"
        onClick={() => setNouvelleVersion(false)}>
        <Icone nom="fermer" />
      </Button>
    </div>
  );
}
