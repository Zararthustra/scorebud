import {
  useEffect,
  useId,
  useRef,
  type MouseEvent,
  type ReactNode
} from 'react';
import { Icone } from './Icone';

type Props = {
  ouvert: boolean;
  surFermeture: () => void;
  titre: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
};

/**
 * Feuille du bas et dialogue d'alerte sur `<dialog>` natif : focus piégé, Échap ferme,
 * le navigateur rend le focus au déclencheur à la fermeture (spec 00 §7).
 */
function useDialogue(ouvert: boolean, surFermeture: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current!;
    if (ouvert && !d.open) d.showModal();
    if (!ouvert && d.open) d.close();
  }, [ouvert]);
  return {
    ref,
    onClose: () => ouvert && surFermeture(),
    // Un appui sur le voile (hors du contenu) ferme la feuille.
    onClick: (e: MouseEvent) => e.target === ref.current && surFermeture()
  };
}

export function Sheet({ ouvert, surFermeture, titre, aside, children }: Props) {
  const id = useId();
  const dialogue = useDialogue(ouvert, surFermeture);
  return (
    <dialog
      className="sb-dialog sb-dialog--sheet"
      aria-labelledby={id}
      {...dialogue}>
      {ouvert && (
        <div className="sb-sheet">
          <span className="sb-sheet__handle" aria-hidden="true" />
          <div className="sb-sheet__titre">
            <h2 id={id} className="h2">
              {titre}
            </h2>
            {aside && <span className="small sb-muted">{aside}</span>}
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}

/** Décision irréversible (T2) : fenêtre centrée, le bouton destructeur n'a jamais le focus initial. */
export function Dialog({
  ouvert,
  surFermeture,
  titre,
  description,
  children
}: Omit<Props, 'aside'> & { description: ReactNode }) {
  const id = useId();
  const dialogue = useDialogue(ouvert, surFermeture);
  return (
    <dialog
      className="sb-dialog sb-dialog--alerte"
      role="alertdialog"
      aria-labelledby={`${id}-t`}
      aria-describedby={`${id}-d`}
      {...dialogue}>
      {ouvert && (
        <div className="sb-alerte">
          <span className="sb-alerte__icone">
            <Icone nom="alerte" taille={28} />
          </span>
          <h2 id={`${id}-t`} className="h2">
            {titre}
          </h2>
          <p id={`${id}-d`} className="sb-muted">
            {description}
          </p>
          <div className="sb-sheet__actions">{children}</div>
        </div>
      )}
    </dialog>
  );
}
