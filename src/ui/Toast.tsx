import { Button, BoutonIcone } from './Button';
import { Icone } from './Icone';

export type ToastProps = {
  type: 'info' | 'success' | 'error';
  message: string;
  detail?: string;
  action?: { libelle: string; icone?: 'annuler'; faire: () => void };
  surFermeture: () => void;
};

const ICONES = { info: 'info', success: 'succes', error: 'alerte' } as const;

/** Information et succès : barre de 5 s qui se vide ; erreur : reste jusqu'à fermeture (README Toast). */
export function Toast({
  type,
  message,
  detail,
  action,
  surFermeture
}: ToastProps) {
  return (
    <div
      className={`sb-toast sb-toast--${type}`}
      role={type === 'error' ? 'alert' : 'status'}>
      <span className="sb-toast__icon">
        <Icone nom={ICONES[type]} taille={24} />
      </span>
      <div className="sb-toast__text">
        {message}
        {detail && <small>{detail}</small>}
      </div>
      {action && (
        <Button
          variante="ghost"
          taille="compact"
          icone={action.icone}
          onClick={action.faire}>
          {action.libelle}
        </Button>
      )}
      <BoutonIcone icone="fermer" aria-label="Fermer" onClick={surFermeture} />
      {type !== 'error' && <div className="sb-toast__timer" />}
    </div>
  );
}
