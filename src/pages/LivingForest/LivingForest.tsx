import { useContext, useState } from 'react';

import AppContext, { IAppContext } from '@services/AppContext';

import './LivingForest.scss';

import { Button, Player, ResourceCounter } from '@components/index';

const LivingForest = () => {
  const { players, setPlayers } = useContext<IAppContext>(AppContext);
  const [selectedPlayer, setSelectedPlayer] = useState<any>();

  return (
    <>
      <div className="LivingForest">
        <h1 className=" mt-5 mb-2">Living Forest</h1>

        <ResourceCounter />

        {/* <div className="flex flex-wrap gap-05 my-2 px-1">
          {players.map((player, index) => (
            <Player
              key={index}
              name={player.name}
              selectedPlayer={selectedPlayer}
              onClick={() => setSelectedPlayer(player.name)}
            />
          ))}
        </div> */}

        {/* <Button primary className="mt-2">
          Ajouter le score
        </Button> */}
      </div>
    </>
  );
};
export default LivingForest;
