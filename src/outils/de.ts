/** OUT-01 : un dé à 6 faces ; le générateur est fourni pour un test déterministe. */
export const lancer = (aleatoire: () => number = Math.random) =>
  1 + Math.floor(aleatoire() * 6);
