import { Modal } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';

import { Button, Player } from '@components/index';
import { setLS } from '@services/localStorageService';
import { capitalizeFirstLetter } from '@utils/formatters';
import AppContext, { IAppContext } from '@services/AppContext';

import './Modal.scss';

interface IModalAddPlayersProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

const ModalAddPlayers = ({
  showModal,
  setShowModal
}: IModalAddPlayersProps) => {
  const input = useRef<HTMLInputElement>(null);
  const [player, setPlayer] = useState<string>('');
  const { players, setPlayers } = useContext<IAppContext>(AppContext);

  useEffect(() => {
    if (showModal) input.current?.focus();
  }, [showModal]);

  const addPlayer = (e: React.FormEvent) => {
    e.preventDefault();

    const playerObject = {
      name: capitalizeFirstLetter(player),
      scores: []
    };

    // Save to Context
    setPlayers([...players, playerObject]);
    // Save to LocalStorage as backup
    setLS('players', JSON.stringify([...players, playerObject]));

    setPlayer('');
  };

  return (
    <Modal
      centered
      open={showModal}
      width={400}
      closable={false}
      onCancel={() => {
        setShowModal(false);
        setPlayers([]);
        setLS('players', '[]');
      }}
      footer={
        <div className="flex-col gap-05 w-100">
          <Button
            onClick={() => setShowModal(false)}
            primary
            style={{ fontWeight: 600 }}>
            Confirmer
          </Button>
          <Button
            onClick={() => {
              setShowModal(false);
              setPlayers([]);
              setLS('players', '[]');
            }}>
            Annuler
          </Button>
        </div>
      }>
      <div className="ModalAddPlayers flex-col align-center">
        <h2>Ajouter des joueurs</h2>

        <div className="flex flex-wrap justify-center my-2 gap-05">
          {players.map((player, index) => (
            <Player name={player.name} key={index} />
          ))}
        </div>

        <form
          onSubmit={addPlayer}
          className="ModalAddPlayers__form mb-2 flex w-80 gap-05">
          <input
            ref={input}
            className="w-100"
            type="text"
            placeholder="Nom du joueur"
            maxLength={15}
            value={player}
            onChange={(event) => setPlayer(event.target.value)}
          />
          <Button type="submit" className="py-0 px-2">
            Ajouter
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default ModalAddPlayers;
