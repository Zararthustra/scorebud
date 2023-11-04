import { Tabs } from 'antd';
import { useContext, useState } from 'react';

import { tree, lotus, fire } from '@assets/index';
import { Button, Counter } from '@components/index';
import AppContext, { IAppContext } from '@services/AppContext';

import './WinCounter.scss';
import { addScore } from '@utils/computers';

const WinCounter = () => {
  const { players, setPlayers } = useContext<IAppContext>(AppContext);

  const [treeScore, setTreeScore] = useState<number>(0);
  const [fireScore, setFireScore] = useState<number>(0);
  const [lotusScore, setLotusScore] = useState<number>(0);
  const [activeKey, setActiveKey] = useState<number>(0);

  return (
    <Tabs
      defaultActiveKey="0"
      size="small"
      onChange={(key) => {
        setActiveKey(parseInt(key));
        setTreeScore(0);
        setFireScore(0);
        setLotusScore(0);
      }}
      className="WinCounter__tabs"
      items={players.map((player, index) => ({
        label: player.name,
        key: index.toString(),
        children: (
          <div className="WinCounter__tab flex-col">
            <div className="flex justify-evenly py-2 w-100">
              <Counter
                img={tree}
                alt={'arbre'}
                score={treeScore}
                setScore={setTreeScore}
              />
              <Counter
                img={fire}
                alt={'feu'}
                score={fireScore}
                setScore={setFireScore}
              />
              <Counter
                img={lotus}
                alt={'lotus'}
                score={lotusScore}
                setScore={setLotusScore}
              />
            </div>

            <Button
              primary
              className=""
              onClick={() => {
                addScore(
                  players[activeKey].name,
                  treeScore + fireScore + lotusScore,
                  players,
                  setPlayers
                );
                setTreeScore(0);
                setFireScore(0);
                setLotusScore(0);
              }}
              disabled={!!!treeScore && !!!fireScore && !!!lotusScore}>
              <p className="m-0">
                Ajouter <strong>{treeScore + fireScore + lotusScore}</strong>{' '}
                pour la manche{' '}
                <strong>{players[activeKey].scores.length + 1}</strong>
              </p>
            </Button>
          </div>
        )
      }))}
    />
  );
};

export default WinCounter;
