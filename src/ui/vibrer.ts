/** T5 : retour haptique seulement si l'appareil le permet (navigator.vibrate absent sur iOS). */
export const vibrer = (motif: number | number[] = 10) =>
  void navigator.vibrate?.(motif);
