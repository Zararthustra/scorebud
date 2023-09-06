import { createContext } from 'react';

import { IPlayer } from '@interfaces/index';

export interface IAppContext {
  players: IPlayer[];
  setPlayers: (value: IPlayer[]) => void;
}

const AppContext = createContext<IAppContext>({
  players: [
    {
      name: 'Joueur 1',
      scores: []
    }
  ],
  setPlayers: () => null
});

export default AppContext;
