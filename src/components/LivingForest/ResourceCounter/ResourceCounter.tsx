import { Tabs } from 'antd';
import { useState } from 'react';

import {
  IconCards,
  IconReset,
  IconTree,
  drop,
  move,
  plant,
  sun
} from '@assets/index';
import { Button, Counter } from '@components/index';

import './ResourceCounter.scss';

const ResourceCounter = () => {
  const [treePlantScore, setTreePlantScore] = useState<number>(0);
  const [cardPlantScore, setCardPlantScore] = useState<number>(0);

  const [treeSunScore, setTreeSunScore] = useState<number>(0);
  const [cardSunScore, setCardSunScore] = useState<number>(0);

  const [treeDropScore, setTreeDropScore] = useState<number>(0);
  const [cardDropScore, setCardDropScore] = useState<number>(0);

  const [treeMoveScore, setTreeMoveScore] = useState<number>(0);
  const [cardMoveScore, setCardMoveScore] = useState<number>(0);

  const resetCardsDisabled =
    !!!cardPlantScore &&
    !!!cardSunScore &&
    !!!cardDropScore &&
    !!!cardMoveScore;
  const resetTreesDisabled =
    !!!treePlantScore &&
    !!!treeSunScore &&
    !!!treeDropScore &&
    !!!treeMoveScore;

  return (
    <Tabs
      defaultActiveKey="1"
      size="small"
      type="card"
      className="ResourceCounter__tabs"
      items={[
        // =================== Cards ==================
        {
          label: (
            <div className="flex gap-05">
              <IconCards />
              Cartes
            </div>
          ),
          key: '1',
          children: (
            <div className="ResourceCounter__tab pt-1 grid grid-cols-2 gap-1">
              <Counter
                img={plant}
                alt={'plante'}
                treeScore={treePlantScore}
                score={cardPlantScore}
                setScore={setCardPlantScore}
              />

              <Counter
                img={sun}
                alt={'soleil'}
                treeScore={treeSunScore}
                score={cardSunScore}
                setScore={setCardSunScore}
              />

              <Counter
                img={drop}
                alt={'eau'}
                treeScore={treeDropScore}
                score={cardDropScore}
                setScore={setCardDropScore}
              />

              <Counter
                img={move}
                alt={'mouvement'}
                treeScore={treeMoveScore}
                score={cardMoveScore}
                setScore={setCardMoveScore}
              />

              <Button
                primary
                className={
                  resetCardsDisabled ? 'col-span-2' : 'bc-red col-span-2'
                }
                onClick={() => {
                  setCardPlantScore(0);
                  setCardSunScore(0);
                  setCardDropScore(0);
                  setCardMoveScore(0);
                  navigator.vibrate([50, 50, 50]);
                }}
                disabled={resetCardsDisabled}>
                <IconReset />
                <p className="m-0">Reset</p>
              </Button>
            </div>
          )
        },
        // =================== Trees ==================
        {
          label: (
            <div className="flex gap-05">
              <IconTree />
              Arbres
            </div>
          ),
          key: '2',
          children: (
            <div className="ResourceCounter__tab pt-1 grid grid-cols-2 gap-1">
              <Counter
                img={plant}
                alt={'plante'}
                score={treePlantScore}
                setScore={setTreePlantScore}
              />

              <Counter
                img={sun}
                alt={'soleil'}
                score={treeSunScore}
                setScore={setTreeSunScore}
              />

              <Counter
                img={drop}
                alt={'eau'}
                score={treeDropScore}
                setScore={setTreeDropScore}
              />

              <Counter
                img={move}
                alt={'mouvement'}
                score={treeMoveScore}
                setScore={setTreeMoveScore}
              />

              <Button
                primary
                className={
                  resetTreesDisabled ? 'col-span-2' : 'bc-red col-span-2'
                }
                onClick={() => {
                  setTreePlantScore(0);
                  setTreeSunScore(0);
                  setTreeDropScore(0);
                  setTreeMoveScore(0);
                  navigator.vibrate([50, 50, 50]);
                }}
                disabled={resetTreesDisabled}>
                <IconReset />
                <p className="m-0">Reset</p>
              </Button>
            </div>
          )
        }
      ]}
    />
  );
};

export default ResourceCounter;
