import contree from './contree/module';
import factice from './factice/module';
import generique from './generique/module';
import livingForest from './living-forest/module';
import type { ModuleDeJeu } from './types';

/** LA liste des jeux : seul fichier touché pour en ajouter un (MOD-01). Le module factice n'existe que dans le build de test. */
export const modules: ModuleDeJeu[] = [
  generique,
  contree,
  livingForest,
  ...(import.meta.env.MODE === 'e2e' ? [factice] : [])
];
