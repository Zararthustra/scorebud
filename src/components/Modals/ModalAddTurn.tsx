import { Modal } from 'antd';
import { useContext, useState } from 'react';

import { Button, Player } from '@components/index';
import { setLS } from '@services/localStorageService';
import AppContext, { IAppContext } from '@services/AppContext';

import './Modal.scss';
import { IPlayer } from '@interfaces/player.interface';

interface IModalAddTurnProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

const ModalAddTurn = ({ showModal, setShowModal }: IModalAddTurnProps) => {
  const { players, setPlayers } = useContext<IAppContext>(AppContext);
  const [newScores, setNewScores] = useState<number[]>(
    players.map((player) => 0)
  );

  const addScore = (event: any, playerIndex: number) => {
    const score = parseInt(event.target.value);
    let updatedScores: number[] = newScores.slice();

    updatedScores[playerIndex] = score;
    setNewScores(updatedScores);
  };

  const addTurn = () => {
    let updatedPlayers: IPlayer[] = Object.assign([], players);

    for (let i = 0; i < updatedPlayers.length; i++) {
      updatedPlayers[i].scores.push(newScores[i]);
    }

    setPlayers(updatedPlayers);
    setLS('players', JSON.stringify(updatedPlayers));
    setShowModal(false);
    setNewScores(players.map((player) => 0));
  };

  const inverseScore = (index: number) => {
    const score = newScores[index];
    let updatedScores: number[] = newScores.slice();

    updatedScores[index] = score * -1;
    setNewScores(updatedScores);
  };

  return (
    <Modal
      centered
      open={showModal}
      width={400}
      closable={false}
      onCancel={() => {
        setShowModal(false);
        setNewScores(players.map((player) => 0));
      }}
      footer={
        <div className="flex-col gap-05 w-100">
          <Button primary onClick={addTurn} style={{ fontWeight: 600 }}>
            Ajouter
          </Button>
          <Button
            onClick={() => {
              setShowModal(false);
              setNewScores(players.map((player) => 0));
            }}>
            Annuler
          </Button>
        </div>
      }>
      <div className="ModalAddTurn flex-col align-center">
        <h2>Ajouter une manche</h2>

        <div className="flex-col justify-center my-2 gap-05 w-100">
          {players.map((player, index) => (
            <div className="flex justify-between align-center" key={index}>
              <Player name={player.name} />
              {/* Samsung phones do not allow minus sign..... */}
              <div className="flex gap-05" style={{ height: '100%' }}>
                <Button
                  className="py-0 f-b f-s"
                  onClick={() => inverseScore(index)}>
                  -
                </Button>
                <input
                  type="number"
                  placeholder="Score"
                  maxLength={50}
                  value={newScores[index] || ''}
                  onChange={(event) => addScore(event, index)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default ModalAddTurn;

{
  /* <form
  onSubmit={addPlayer}
  className="ModalAddTurn__form mb-2 flex w-80 gap-05">
  <input
    className="w-100"
    type="text"
    placeholder="Nom du joueur"
    maxLength={50}
    value={player}
    onChange={(event) => setPlayer(event.target.value)}
  />
  <Button type="submit" className="py-0 px-2">
    Ajouter
  </Button>
</form> */
}
