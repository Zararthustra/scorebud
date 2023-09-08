import { IPlayer } from '@interfaces/index';
import { setLS } from '@services/localStorageService';

export const addScore = (
  player: string,
  score: number,
  players: IPlayer[],
  setPlayers: (value: IPlayer[]) => void
) => {
  let updatedPlayers: IPlayer[] = Object.assign([], players);

  for (let i = 0; i < updatedPlayers.length; i++) {
    if (updatedPlayers[i].name === player) updatedPlayers[i].scores.push(score);
  }

  setPlayers(updatedPlayers);
  setLS('players', JSON.stringify(updatedPlayers));
};
