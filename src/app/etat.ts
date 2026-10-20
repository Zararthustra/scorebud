import { useSyncExternalStore } from 'react';
import { creerMagasin, type Theme } from '../core/magasin';
import { modules } from '../modules';
import type { ModuleDeJeu } from '../modules/types';
import { afficherToast } from './Toasts';

/** Le magasin de l'application : une seule instance, partagée par tous les écrans. */
export const magasin = creerMagasin((id) =>
  afficherToast({
    type: 'error',
    message: 'La partie enregistrée n’a pas pu être relue.',
    detail: `${modules.find((m) => m.id === id)?.nom} repart d’une partie vide.`
  })
);

export const useMagasin = <T>(lecture: () => T) =>
  useSyncExternalStore(magasin.abonner, lecture, lecture);

export const usePartie = (m: ModuleDeJeu) =>
  useMagasin(() => magasin.partie(m));

/** Même règle que le script d'index.html, qui la pose avant le premier rendu. */
export function appliquerTheme(theme: Theme) {
  const sombre =
    theme === 'sombre' ||
    (theme !== 'clair' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = sombre ? 'dark' : 'light';
}

/** Vocabulaire selon le genre des participants du module. */
export const mots = (m: ModuleDeJeu) =>
  m.participants.genre === 'equipes'
    ? {
        un: 'équipe',
        plusieurs: 'équipes',
        titre: 'Équipes',
        aucun: 'Aucune équipe pour l’instant',
        ajouter: 'Ajouter des équipes'
      }
    : {
        un: 'joueur',
        plusieurs: 'joueurs',
        titre: 'Joueurs',
        aucun: 'Aucun joueur pour l’instant',
        ajouter: 'Ajouter des joueurs'
      };

export const compter = (n: number, m: ModuleDeJeu) =>
  `${n} ${n > 1 ? mots(m).plusieurs : mots(m).un}`;
