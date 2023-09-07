import { useContext, useState } from 'react';

import AppContext, { IAppContext } from '@services/AppContext';
import { Button, ModalAddPlayers, Player, ScoreTable } from '@components/index';

import './Score.scss';

const Score = () => {
  const { players, setPlayers } = useContext<IAppContext>(AppContext);
  const [showAddPlayersModal, setShowAddPlayersModal] =
    useState<boolean>(false);

  return (
    <>
      <ModalAddPlayers
        showModal={showAddPlayersModal}
        setShowModal={setShowAddPlayersModal}
      />

      <div className="Score">
        <h1 className=" mt-5 mb-2">Scores</h1>
        {/* <div className="flex flex-wrap gap-05 my-2 px-1">
          {players.map((player, index) => (
            <Player name={player.name} key={index} />
          ))}
        </div> */}
        {(!!!players || players.length === 0) && (
          <Button
            onClick={() => setShowAddPlayersModal(true)}
            primary
            className="my-2"
            style={{ fontWeight: 600 }}>
            Ajouter des joueurs
          </Button>
        )}
        {players.length > 0 && <ScoreTable players={players} />}
      </div>
    </>
  );
};
export default Score;
