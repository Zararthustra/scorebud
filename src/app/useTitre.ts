import { useEffect } from 'react';

/** Chaque page a son titre de document (spec 00 §4). */
export const useTitre = (titre: string) =>
  useEffect(() => {
    document.title = `Scorebud · ${titre}`;
  }, [titre]);
