import { useState, useSyncExternalStore } from 'react';
import { DELAI_ANNULATION } from '../core/magasin';
import { Toast, type ToastProps } from '../ui/Toast';
import { magasin, useMagasin } from './etat';

type Message = Omit<ToastProps, 'surFermeture'> & { id: number };

let messages: Message[] = [];
let suivant = 0;
const abonnes = new Set<() => void>();
const notifier = () => abonnes.forEach((f) => f());

const retirer = (id: number) => {
  messages = messages.filter((m) => m.id !== id);
  notifier();
};

/** Affiche un toast ; information et succès disparaissent après 5 s, une erreur reste jusqu'à fermeture. */
export function afficherToast(t: Omit<Message, 'id'>) {
  // Différé : peut être appelé pendant un rendu (lecture d'une partie illisible).
  queueMicrotask(() => {
    const id = suivant++;
    messages = [...messages, { ...t, id }];
    if (t.type !== 'error') setTimeout(() => retirer(id), DELAI_ANNULATION);
    notifier();
  });
}

const abonner = (f: () => void) => {
  abonnes.add(f);
  return () => void abonnes.delete(f);
};

/** Région des toasts, en haut de l'écran : l'action annulable du magasin (T1) puis les messages, 3 au plus. */
export function Toasts() {
  const liste = useSyncExternalStore(
    abonner,
    () => messages,
    () => messages
  );
  const annulable = useMagasin(() => magasin.annulable());
  const [masque, setMasque] = useState<typeof annulable>(null);
  const visibles = liste.slice(annulable && annulable !== masque ? -2 : -3);
  return (
    <div className="sb-toasts">
      {annulable && annulable !== masque && (
        <Toast
          type="success"
          message={annulable.message}
          detail={annulable.detail}
          action={{
            libelle: 'Annuler',
            icone: 'annuler',
            faire: () => magasin.annuler()
          }}
          surFermeture={() => setMasque(annulable)}
        />
      )}
      {visibles.map(({ id, ...m }) => (
        <Toast key={id} {...m} surFermeture={() => retirer(id)} />
      ))}
    </div>
  );
}
