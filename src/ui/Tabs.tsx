import * as RadixTabs from '@radix-ui/react-tabs';
import type { ReactNode } from 'react';

type Onglet = { id: string; libelle: ReactNode; contenu: ReactNode };

/**
 * Onglets accessibles (Radix : flèches, Début, Fin, aria-selected) sur les classes du design system.
 * `navigation` : onglets principaux d'un écran de jeu, l'actif porte aussi `aria-current="page"` (spec 00 §4).
 */
export function Tabs({
  onglets,
  valeur,
  surChangement,
  libelle,
  navigation
}: {
  onglets: Onglet[];
  valeur: string;
  surChangement: (id: string) => void;
  libelle: string;
  navigation?: boolean;
}) {
  return (
    <RadixTabs.Root
      value={valeur}
      onValueChange={surChangement}
      className="sb-stack">
      <RadixTabs.List className="sb-tabs" aria-label={libelle}>
        {onglets.map((o) => (
          <RadixTabs.Trigger
            key={o.id}
            value={o.id}
            className="sb-tab"
            aria-current={navigation && o.id === valeur ? 'page' : undefined}>
            {o.libelle}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {onglets.map((o) => (
        <RadixTabs.Content
          key={o.id}
          value={o.id}
          className="sb-stack"
          tabIndex={-1}>
          {o.contenu}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}
