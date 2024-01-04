import { Switch } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';

import { IconClose, IconReset } from '@assets/index';
import { addScore } from '@utils/computers';
import { tradTrump } from '@utils/formatters';
import { Button, Card } from '@components/index';
import { ISetupContree } from '@interfaces/index';
import { getLS, setLS } from '@services/localStorageService';
import AppContext, { IAppContext } from '@services/AppContext';

import './Counter.scss';

interface ICounterProps {
  setSetup: (value: string) => void;
  setup: ISetupContree;
}
const Counter = ({ setSetup, setup }: ICounterProps) => {
  const navigate = useNavigate();
  const { players, setPlayers } = useContext<IAppContext>(AppContext);
  const cards = ['A', '10', 'R', 'D', 'V'];
  const trumpCards = ['V', '9', 'A', '10', 'R', 'D'];
  const [points, setPoints] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const capot = setup.contract === 'capot';
  const [capotOK, setCapotOK] = useState<boolean>(false);
  const calculateTeam = getLS('calculate');
  const rebelotePoints = setup.rebeloteTeam === calculateTeam ? 20 : 0;
  const totalPoints = setup.rebelote ? 180 : 160;
  const objective =
    calculateTeam === setup.bid
      ? parseInt(setup.contract)
      : (setup.rebelote ? 180 : 160) - parseInt(setup.contract);

  const roundScore = (x: number) => Math.round(x / 10) * 10;

  useEffect(() => {
    // Compute score with capot(250), rebelote(20) & lastPli(10) bonus
    if (capotOK) setScore(250);
    else if (setup.rebeloteTeam === calculateTeam) {
      if (setup.lastPli === calculateTeam && !capot)
        setScore(points.reduce((a, b) => a + b, 20 + 10));
      else setScore(points.reduce((a, b) => a + b, 20));
    } else if (setup.lastPli === calculateTeam && !capot)
      setScore(points.reduce((a, b) => a + b, 10));
    else setScore(points.reduce((a, b) => a + b, 0));
  }, [points, capotOK]);

  useEffect(() => {
    // Contre
    if (setup.bid === calculateTeam && score >= objective) {
      if (setup.contre) setScore(320 + (setup.rebelote ? 20 : 0));
      if (setup.surcontre) setScore(640 + (setup.rebelote ? 20 : 0));
      // Strict > if bidTeam != calculateTeam
    } else if (setup.bid !== calculateTeam && score > objective) {
      if (setup.contre) setScore(320 + (setup.rebelote ? 20 : 0));
      if (setup.surcontre) setScore(640 + (setup.rebelote ? 20 : 0));
    }
  }, [score]);

  useEffect(() => {
    // Capot
    if (capot) {
      if (calculateTeam === setup.bid) {
        if (capotOK)
          setScore(
            (setup.surcontre ? 2000 : setup.contre ? 1000 : 500) +
              (setup.contre && setup.rebelote ? 20 : rebelotePoints)
          );
        if (!capotOK) setScore(0);
      } else {
        if (capotOK)
          setScore(0 + (setup.contre && setup.rebelote ? 0 : rebelotePoints));
        if (!capotOK)
          setScore(
            (setup.surcontre ? 2000 : setup.contre ? 1000 : 500) +
              (setup.contre && setup.rebelote ? 20 : setup.rebelote ? 20 : 0)
          );
      }
    }
  }, [capotOK, score]);

  const handleAddFinalScore = () => {
    players.map((player) => {
      // Add points to calculateTeam
      if (player.name === calculateTeam) {
        // Capot
        if (capot && !capotOK && player.name === setup.bid)
          addScore(player.name, 0, players, setPlayers);
        // Contre/surcontre
        else if (setup.contre && score < objective)
          addScore(player.name, 0, players, setPlayers);
        // Nominal
        else addScore(player.name, roundScore(score), players, setPlayers);

        // Add points to not calculateTeam
      } else {
        // Capot
        if (capot) {
          if (capotOK && player.name !== setup.bid)
            addScore(
              player.name,
              0 + (player.name === setup.rebeloteTeam ? 20 : 0),
              players,
              setPlayers
            );
          else if (!capotOK && player.name === setup.bid)
            addScore(player.name, 0, players, setPlayers);
          else if (capotOK && player.name === setup.bid)
            addScore(
              player.name,
              (setup.surcontre ? 2000 : setup.contre ? 1000 : 500) +
                (setup.contre && setup.rebelote
                  ? 20
                  : player.name === setup.rebeloteTeam
                  ? 20
                  : 0),
              players,
              setPlayers
            );
          else if (!capotOK && player.name !== setup.bid)
            addScore(
              player.name,
              (setup.surcontre ? 2000 : setup.contre ? 1000 : 500) +
                (setup.contre && setup.rebelote ? 20 : setup.rebelote ? 20 : 0),
              players,
              setPlayers
            );
        } else if (capotOK) {
          addScore(player.name, 0, players, setPlayers);
        }
        // Contre/surcontre
        else if (setup.contre && score < objective)
          addScore(
            player.name,
            (setup.surcontre ? 640 : 320) + (setup.rebelote ? 20 : 0),
            players,
            setPlayers
          );
        else if (setup.contre && score > objective)
          addScore(player.name, 0, players, setPlayers);
        // Nominal
        else
          addScore(
            player.name,
            roundScore(totalPoints - score),
            players,
            setPlayers
          );
      }
    });
  };

  return (
    <div className="Counter">
      <IconClose
        className="self-start"
        style={{ color: 'var(--color-primary-500)', cursor: 'pointer' }}
        onClick={() => {
          setSetup('');
          setLS('contree', '');
        }}
      />

      {/* Score */}
      <div
        className="flex align-end gap-05 my-1"
        style={{ position: 'relative' }}>
        <p className="Counter__counter">{score}</p>
        {!capot && (
          <div
            className="Counter__contract"
            style={
              setup.bid === calculateTeam && score >= objective
                ? { color: 'var(--color-green-500)' }
                : setup.bid !== calculateTeam && score > objective
                ? { color: 'var(--color-green-500)' }
                : {}
            }>
            /{objective}
          </div>
        )}
      </div>

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
          <p className="Counter__setup">Dix de der:</p>
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

        {setup.contre && (
          <div className="flex gap-05">
            <p className="Counter__setup">Surcontré:</p>
            <p className="Counter__setup">{setup.surcontre ? 'oui' : 'non'}</p>
          </div>
        )}
      </div>

      {/* Cards */}
      {!capot && !capotOK && <h2 className="self-start">Atouts</h2>}
      {!capot && !capotOK && (
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
      )}
      {!capot && !capotOK && <h2 className="self-start">Autres</h2>}
      {!capot && !capotOK && (
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
      )}

      <div className="flex gap-1 align-center mt-2">
        <div>
          <strong>{capot ? setup.bid : calculateTeam} </strong>a remporté tous
          les plis ?
        </div>
        <Switch
          onChange={() => {
            setCapotOK(!capotOK);
            navigator.vibrate(50);
          }}
        />
      </div>

      {/* Buttons */}
      <div className="flex-col gap-05 mt-2 w-100">
        <div className="flex gap-05">
          {!capot && !capotOK && (
            <Button
              className="w-100"
              style={{ fontSize: '0.75rem', lineHeight: '12px' }}
              onClick={() => {
                setPoints(points.slice(0, -1));
              }}>
              <IconReset size={15} />
              Annuler dernier
            </Button>
          )}
          {!capot && (
            <Button
              className="w-100"
              style={{ fontSize: '0.75rem', lineHeight: '12px' }}
              onClick={() => {
                navigate(0);
              }}>
              <IconReset size={15} />
              Recommencer calcul
            </Button>
          )}
        </div>
        <Button
          primary
          onClick={() => {
            handleAddFinalScore();
            setSetup('');
            setLS('contree', '');
          }}>
          Comptabiliser la manche
        </Button>
      </div>
    </div>
  );
};

export default Counter;
