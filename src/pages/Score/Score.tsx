import { useContext, useState } from 'react';

import { IconReset } from '@assets/index';
import AppContext, { IAppContext } from '@services/AppContext';
import { Button, ModalAddPlayers, ScoreTable } from '@components/index';

import './Score.scss';
import { setLS } from '@services/localStorageService';

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

        {players.length > 0 && <ScoreTable players={players} />}

        {!!!players || players.length === 0 ? (
          <Button
            onClick={() => setShowAddPlayersModal(true)}
            primary
            className="my-2"
            style={{ fontWeight: 600 }}>
            Ajouter des joueurs
          </Button>
        ) : (
          <Button
            onClick={() => {
              setPlayers(
                players.map((player) => ({ name: player.name, scores: [] }))
              );
              setLS(
                'players',
                JSON.stringify(
                  players.map((player) => ({ name: player.name, scores: [] }))
                )
              );
            }}
            primary
            className="my-2"
            style={{ fontWeight: 600 }}>
            <IconReset />
            Nouvelle partie
          </Button>
        )}
      </div>
    </>
  );
};
export default Score;
