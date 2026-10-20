import type { ButtonHTMLAttributes } from 'react';
import { Icone, type NomIcone } from './Icone';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  taille?: 'compact' | 'large';
  bloc?: boolean;
  icone?: NomIcone;
};

/** Bouton du design system. Indisponible : `aria-disabled`, jamais `disabled` (il reste focusable et dit pourquoi). */
export function Button({
  variante = 'secondary',
  taille,
  bloc,
  icone,
  className,
  children,
  ...props
}: Props) {
  const classes = [
    'sb-btn',
    `sb-btn--${variante}`,
    taille && `sb-btn--${taille}`,
    bloc && 'sb-btn--block',
    className
  ];
  return (
    <button
      type="button"
      className={classes.filter(Boolean).join(' ')}
      {...props}>
      {icone && <Icone nom={icone} />}
      {children}
    </button>
  );
}

/** Bouton icône seule de 44px, nommé par `aria-label`. */
export function BoutonIcone({
  icone,
  ...props
}: Omit<Props, 'icone' | 'children'> & {
  icone: NomIcone;
  'aria-label': string;
}) {
  return (
    <Button
      variante="ghost"
      taille="compact"
      className="sb-btn-icone"
      {...props}>
      <Icone nom={icone} taille={24} />
    </Button>
  );
}
