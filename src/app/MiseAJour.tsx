import { useRegisterSW } from 'virtual:pwa-register/react';
import { afficherToast } from './Toasts';

/**
 * Spec 00 §8 : « Prêt pour une utilisation hors ligne » une seule fois.
 * Les mises à jour s'appliquent d'elles-mêmes (registerType autoUpdate, vite.config.ts).
 */
export function MiseAJour() {
  useRegisterSW({
    onOfflineReady: () =>
      afficherToast({
        type: 'info',
        message: 'Prêt pour une utilisation hors ligne'
      })
  });
  return null;
}
