// Un seul jeu d'icônes (design system) : contour, grille 24px, trait 2px, couleur héritée.
const TRACES = {
  plus: 'M12 5v14M5 12h14',
  moins: 'M5 12h14',
  coche: 'M5 13l4 4L19 7',
  fermer: 'M6 6l12 12M18 6L6 18',
  annuler: 'M9 14L4 9l5-5M4 9h10a6 6 0 010 12h-3',
  corbeille: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  info: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 11v5M12 8h.01',
  alerte: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 8v5M12 16h.01',
  succes: 'M12 3a9 9 0 100 18 9 9 0 000-18zM8 12.5l3 3 5-6',
  reinitialiser: 'M4 12a8 8 0 108-8H7M7 4L4 7l3 3',
  retour: 'M15 18l-6-6 6-6',
  suivant: 'M9 6l6 6-6 6',
  haut: 'M6 15l6-6 6 6',
  bas: 'M6 9l6 6 6-6',
  minuteur: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2',
  de: 'M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1zM9 9h.01M15 15h.01M12 12h.01',
  reglages: 'M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4',
  menu: 'M5 12h.01M12 12h.01M19 12h.01',
  joueurs:
    'M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M9.5 10a3 3 0 100-6 3 3 0 000 6zM21 19v-1a4 4 0 00-3-3.9M15.5 4.1a3 3 0 010 5.8',
  tableau: 'M4 5h16v14H4zM4 10h16M10 5v14',
  externe:
    'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5'
};

export type NomIcone = keyof typeof TRACES;

export function Icone({
  nom,
  taille = 20,
  trace
}: {
  nom?: NomIcone;
  taille?: number;
  trace?: string;
}) {
  return (
    <svg
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={nom === 'menu' ? 3 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <path d={trace ?? TRACES[nom!]} />
    </svg>
  );
}
