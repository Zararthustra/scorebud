// Seul accès à localStorage de l'application (ADR-003), hors script de thème d'index.html.

const ANCIENNES_CLES = [
  'players',
  'contree',
  'calculate',
  'accessToken',
  'refreshToken'
];

/** Valeur lue, ou null ; `illisible` signale une valeur présente mais corrompue ou invalide (spec 00 §5). */
export function lire<T>(
  cle: string,
  valide: (v: unknown) => v is T
): { valeur: T | null; illisible: boolean } {
  let brut: string | null;
  try {
    brut = localStorage.getItem(cle);
  } catch {
    return { valeur: null, illisible: false };
  }
  if (brut === null) return { valeur: null, illisible: false };
  try {
    const v: unknown = JSON.parse(brut);
    if (valide(v)) return { valeur: v, illisible: false };
  } catch {
    // JSON illisible : même traitement qu'une structure invalide.
  }
  return { valeur: null, illisible: true };
}

/** false si l'écriture échoue (stockage plein ou bloqué) : l'application continue en mémoire. */
export function ecrire(cle: string, valeur: unknown): boolean {
  try {
    localStorage.setItem(cle, JSON.stringify(valeur));
    return true;
  } catch {
    return false;
  }
}

/** GEN-10 : supprime les clés de l'ancienne version sans les lire. */
export function nettoyerAnciennesCles(): void {
  try {
    ANCIENNES_CLES.forEach((cle) => localStorage.removeItem(cle));
  } catch {
    // Stockage bloqué : rien à nettoyer.
  }
}

/** GEN-07 : supprime les seules clés `scorebud:`, jamais localStorage.clear(). */
export function effacerTout(): void {
  try {
    const cles = Array.from({ length: localStorage.length }, (_, i) =>
      localStorage.key(i)
    );
    cles
      .filter((c) => c?.startsWith('scorebud:'))
      .forEach((c) => localStorage.removeItem(c!));
  } catch {
    // Stockage bloqué : rien à effacer.
  }
}
