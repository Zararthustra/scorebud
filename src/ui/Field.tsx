import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref
} from 'react';
import { Icone } from './Icone';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  libelle: string;
  erreur?: string;
  aide?: ReactNode;
  apres?: ReactNode;
  ref?: Ref<HTMLInputElement>;
};

/** Champ : libellé au-dessus, erreur nommée (icône + texte) et compteur de caractères en dessous. */
export function Field({ libelle, erreur, aide, apres, ref, ...props }: Props) {
  const id = useId();
  const longueur = String(props.value ?? '').length;
  return (
    <div className="sb-field sb-field--large">
      <label className="sb-field__label" htmlFor={id}>
        {libelle}
      </label>
      <div className="sb-row sb-row--serre">
        <input
          ref={ref}
          id={id}
          className="sb-field__input"
          aria-invalid={erreur ? true : undefined}
          aria-describedby={erreur ? `${id}-e` : undefined}
          {...props}
        />
        {apres}
      </div>
      <div className="sb-field__meta">
        {erreur ? (
          <span id={`${id}-e`} className="sb-field__msg sb-field__msg--error">
            <Icone nom="alerte" taille={16} />
            {erreur}
          </span>
        ) : (
          <span>{aide}</span>
        )}
        {props.maxLength && (
          <span aria-hidden="true">
            {longueur}/{props.maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
