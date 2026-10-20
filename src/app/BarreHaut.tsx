import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Icone } from '../ui/Icone';
import logo from '../ui/logo.svg';
import { Outils } from '../outils/Outils';

/** Barre du haut (R2) : catalogue (logo et nom) ou jeu (retour, nom du jeu). Les outils s'ajoutent à droite. */
export function BarreHaut({
  titre,
  children
}: {
  titre?: string;
  children: ReactNode;
}) {
  return (
    <header className="sb-barre">
      {titre ? (
        <>
          <Link
            to="/"
            className="sb-btn sb-btn--ghost sb-btn--compact sb-btn-icone"
            aria-label="Retour au catalogue">
            <Icone nom="retour" taille={24} />
          </Link>
          <h1 className="sb-barre__titre h2">{titre}</h1>
        </>
      ) : (
        <>
          <img src={logo} alt="" className="sb-barre__logo" />
          <span className="sb-barre__titre h2">ScoreBud</span>
        </>
      )}
      <Outils />
      {children}
    </header>
  );
}
