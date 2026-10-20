import type { ModuleDeJeu } from '../modules/types';
import { Icone } from '../ui/Icone';

/** Onglet « Règles » commun (R4) : liens vers les règles officielles, puis le barème appliqué par ScoreBud. */
export function OngletRegles({ module }: { module: ModuleDeJeu }) {
  const { Regles, liensRegles } = module;
  return (
    <>
      {liensRegles.length > 0 && (
        <ul className="sb-liste sb-liste--serree">
          {liensRegles.map((l) => (
            <li key={l.url}>
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="sb-carte sb-carte--lien">
                <span className="sb-carte__texte">
                  <span className="body-strong">{l.titre}</span>
                  <span className="small sb-muted">
                    PDF externe, s’ouvre dans un nouvel onglet
                  </span>
                </span>
                <Icone nom="externe" />
              </a>
            </li>
          ))}
        </ul>
      )}
      {Regles && (
        <div className="sb-stack">
          <h2 className="h2">Comment ScoreBud compte</h2>
          <Regles />
        </div>
      )}
    </>
  );
}
