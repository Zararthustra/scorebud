import type { ComponentType } from 'react';
import type { DefinitionPartie } from '../core/magasin';
import type { ParticipantId, Partie, Points } from '../core/partie';

/** Ce que l'application donne à un onglet de saisie (plan technique §4) : le module ne touche jamais au stockage (R3). */
export type PropsSaisie<B> = {
  partie: Partie<B>; // lecture seule
  majBrouillon: (b: B) => void;
  ajouterSaisie: (
    points: Points,
    toast: { message: string; voirScore?: boolean }
  ) => void;
};

/** Le contrat d'un jeu (la prise de la multiprise, spec 01). */
export type ModuleDeJeu<B = unknown> = DefinitionPartie<B> & {
  nom: string;
  description: string; // une ligne, dans le catalogue
  icone: string; // tracé SVG 24px, dessiné comme les icônes du design system
  route: string;
  participants: { genre: 'joueurs' | 'equipes'; min: number; max?: number }; // max absent : sans limite
  retirerDerniereSaisie: boolean;
  ongletsSaisie: {
    id: string;
    libelle: string;
    Vue: ComponentType<PropsSaisie<B>>;
  }[];
  Regles?: ComponentType; // barème en clair
  liensRegles: { titre: string; url: string }[];
  statut?: (totaux: Points) => { terminee: boolean; gagnants: ParticipantId[] }; // pure ; absent : jamais terminée
};

/** Typage d'un module avec son brouillon, rangé ensuite dans la liste commune. */
export const definirModule = <B>(m: ModuleDeJeu<B>) =>
  m as unknown as ModuleDeJeu;
