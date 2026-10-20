import { Link } from 'react-router';
import logo from '../ui/logo.svg';
import { useTitre } from './useTitre';

export function PageIntrouvable() {
  useTitre('Page introuvable');
  return (
    <main className="sb-page sb-page--centre">
      <img src={logo} alt="" height={72} />
      <h1 className="h1">Page introuvable</h1>
      <p className="sb-muted">
        Cette adresse ne mène à aucun écran de ScoreBud.
      </p>
      <Link to="/" className="sb-btn sb-btn--primary sb-btn--large">
        Retour au catalogue
      </Link>
    </main>
  );
}
