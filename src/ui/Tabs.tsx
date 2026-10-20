import * as RadixTabs from '@radix-ui/react-tabs';
import type { ReactNode } from 'react';

type Onglet = { id: string; libelle: string; contenu: ReactNode };

/** Onglets accessibles (Radix : flèches, Début, Fin, aria-selected) sur les classes du design system. */
export function Tabs({
  onglets,
  valeur,
  surChangement,
  libelle
}: {
  onglets: Onglet[];
  valeur: string;
  surChangement: (id: string) => void;
  libelle: string;
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
            aria-current={o.id === valeur ? 'page' : undefined}>
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
