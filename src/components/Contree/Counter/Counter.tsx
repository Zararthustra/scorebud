import { useState } from 'react';

import { IconReset } from '@assets/index';
import { Button, Card } from '@components/index';
import { ISetupContree } from '@interfaces/index';
import { getLS, setLS } from '@services/localStorageService';

import './Counter.scss';
import { useNavigate } from 'react-router-dom';
import { tradTrump } from '@utils/formatters';

interface ICounterProps {
  setSetup: (value: string) => void;
  setup: ISetupContree;
}
const Counter = ({ setSetup, setup }: ICounterProps) => {
  const navigate = useNavigate();
  const cards = ['A', '10', 'R', 'D', 'V'];
  const trumpCards = ['V', '9', 'A', '10', 'R', 'D'];
  const [points, setPoints] = useState<number[]>([]);
  const score = points.reduce((a, b) => a + b, 0) || 0;
  const calculateTeam = getLS('calculate');
  const totalPoints =
    calculateTeam === setup.bid
      ? parseInt(setup.contract)
      : (setup.rebelote ? 180 : 160) - parseInt(setup.contract);

  return (
    <div className="Counter">
      {/* Infos */}
      <div className="flex flex-wrap justify-evenly tag--info p-05 gap-05">
        <div className="flex gap-05">
          <p className="Counter__setup">Enchère:</p>
          <p className="Counter__setup">{setup.bid}</p>
        </div>

        <div className="flex gap-05">
          <p className="Counter__setup">Contrat:</p>
          <p className="Counter__setup">{setup.contract}</p>
        </div>

        <div className="flex gap-05">
          <p className="Counter__setup">Atout:</p>
          <p className="Counter__setup">{tradTrump(setup.trump)}</p>
        </div>

        <div className="flex gap-05">
          <p className="Counter__setup">Dernier pli:</p>
          <p className="Counter__setup">{setup.lastPli}</p>
        </div>

        <div className="flex gap-05">
          <p className="Counter__setup">Rebelote:</p>
          <p className="Counter__setup">
            {setup.rebelote ? setup.rebeloteTeam : 'non'}
          </p>
        </div>

        <div className="flex gap-05">
          <p className="Counter__setup">Contré:</p>
          <p className="Counter__setup">{setup.contre ? 'oui' : 'non'}</p>
        </div>
      </div>

      {/* Score */}
      <div
        className="flex align-end gap-05 my-1"
        style={{ position: 'relative' }}>
        <p className="Counter__counter">{score}</p>
        <div
          className="Counter__contract"
          style={
            score >= totalPoints ? { color: 'var(--color-green-500)' } : {}
          }>
          /{totalPoints}
        </div>
      </div>

      {/* Cards */}
      <h2 className="self-start">Atouts</h2>
      <div className="flex flex-wrap justify-evenly w-100 gap-05">
        {trumpCards.map((card, index) => (
          <Card
            value={card}
            trump={setup.trump}
            key={index}
            points={points}
            setPoints={setPoints}
          />
        ))}
      </div>
      <h2 className="self-start">Autres</h2>
      <div className="flex flex-wrap justify-evenly w-100 gap-05">
        {cards.map((card, index) => (
          <Card
            value={card}
            key={index}
            points={points}
            setPoints={setPoints}
          />
        ))}
      </div>

      {/* Buttons */}
      <div className="flex-col gap-05 mt-2 w-100">
        <div className="flex gap-05">
          <Button
            className="w-100"
            onClick={() => {
              setPoints(points.slice(0, -1));
            }}>
            <IconReset />
            Annuler
          </Button>
          <Button
            className="w-100"
            onClick={() => {
              navigate(0);
            }}>
            <IconReset />
            Recommencer
          </Button>
        </div>
        {/* <Button primary>Ajouter la manche</Button> */}
        <Button
          primary
          onClick={() => {
            setSetup('');
            setLS('contree', '');
          }}>
          Nouvelle manche
        </Button>
      </div>
    </div>
  );
};

export default Counter;
