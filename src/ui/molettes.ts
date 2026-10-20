export const CHIFFRES = 6; // P13 : scores de 6 chiffres au plus
const MAX = 10 ** CHIFFRES - 1;

export type Signe = '+' | '−';

/** Vue « cadenas » d'un entier : un signe et 6 chiffres, du plus fort au plus faible. */
export function versChiffres(n: number): { signe: Signe; chiffres: number[] } {
  const abs = Math.min(Math.abs(Math.trunc(n)), MAX);
  return {
    signe: n < 0 ? '−' : '+',
    chiffres: [...String(abs).padStart(CHIFFRES, '0')].map(Number)
  };
}

export function depuisChiffres(signe: Signe, chiffres: number[]): number {
  const abs = chiffres.reduce((a, c) => a * 10 + c, 0);
  return signe === '−' && abs > 0 ? -abs : abs;
}
