import { useState } from 'react';
import { Link } from 'react-router';
import { modules } from '../modules';
import type { ModuleDeJeu } from '../modules/types';
import { BoutonIcone } from '../ui/Button';
import { Icone } from '../ui/Icone';
import { BarreHaut } from './BarreHaut';
import { filtrerJeux, ordonnerJeux } from './ordreCatalogue';
import { magasin, useMagasin, usePartie } from './etat';
import { Reglages } from './Reglages';
import { useTitre } from './useTitre';

// R23 : le tableau de scores libre a sa carte à part, en tête ; ce n'est pas un jeu.
const LIBRE = 'generique';

function EnCours({ module }: { module: ModuleDeJeu }) {
  const p = usePartie(module);
  if (!p.participants.length && !p.saisies.length) return null;
  return (
    <span className="sb-carte__statut">
      <span className="sb-carte__puce" aria-hidden="true" />
      Partie en cours
    </span>
  );
}

function Carte({
  module,
  titre,
  libre
}: {
  module: ModuleDeJeu;
  titre: string;
  libre?: boolean;
}) {
  return (
    <Link
      to={module.route}
      className={libre ? 'sb-carte sb-carte--libre' : 'sb-carte'}>
      <span className="sb-carte__icone" aria-hidden="true">
        <Icone trace={module.icone} taille={28} />
      </span>
      <span className="sb-carte__texte">
        <span className="h3">{titre}</span>
        <span className="small sb-carte__description">
          {module.description}
        </span>
        <EnCours module={module} />
      </span>
      <Icone nom="suivant" />
    </Link>
  );
}

export function Catalogue() {
  useTitre('Jeux');
  const { recents } = useMagasin(() => magasin.preferences());
  const [reglages, setReglages] = useState(false);
  const [recherche, setRecherche] = useState('');
  const libre = modules.find((m) => m.id === LIBRE);
  const jeux = ordonnerJeux(
    modules.filter((m) => m.id !== LIBRE),
    recents
  );
  return (
    <>
      <BarreHaut>
        <BoutonIcone
          icone="reglages"
          aria-label="Réglages"
          onClick={() => setReglages(true)}
        />
      </BarreHaut>
      <main className="sb-page">
        {libre && (
          <Carte module={libre} titre="Tableau de scores libre" libre />
        )}
        <h1 className="h1 sb-page__titre">Jeux</h1>
        {jeux.length > 10 && (
          <input
            type="search"
            className="sb-field__input"
            aria-label="Rechercher un jeu"
            placeholder="Rechercher un jeu"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        )}
        <ul className="sb-liste">
          {filtrerJeux(jeux, recherche).map((m) => (
            <li key={m.id}>
              <Carte module={m} titre={m.nom} />
            </li>
          ))}
        </ul>
        <p className="small sb-muted">
          Les jeux ouverts récemment apparaissent en premier.
        </p>
      </main>
      <Reglages ouvert={reglages} surFermeture={() => setReglages(false)} />
    </>
  );
}
