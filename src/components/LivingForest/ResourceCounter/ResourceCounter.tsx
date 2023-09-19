import { Tabs } from 'antd';
import { useState } from 'react';

import {
  IconCards,
  IconReset,
  IconTree,
  drop,
  fire,
  lotus,
  lotusWhite,
  move,
  plant,
  sun,
  tree
} from '@assets/index';
import { Button, Counter, ResourceTotal } from '@components/index';

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

  const [treeScore, setTreeScore] = useState<number>(0);
  const [fireScore, setFireScore] = useState<number>(0);
  const [lotusScore, setLotusScore] = useState<number>(0);
  const [lotusTreeScore, setLotusTreeScore] = useState<number>(0);

  const resetCardsDisabled =
    !!!cardPlantScore &&
    !!!cardSunScore &&
    !!!cardDropScore &&
    !!!cardMoveScore;
  const resetTreesDisabled =
    !!!treePlantScore &&
    !!!treeSunScore &&
    !!!treeDropScore &&
    !!!treeMoveScore &&
    !!!lotusTreeScore;

  return (
    <>
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
                  score={cardPlantScore}
                  setScore={setCardPlantScore}
                />

                <Counter
                  img={sun}
                  alt={'soleil'}
                  score={cardSunScore}
                  setScore={setCardSunScore}
                />

                <Counter
                  img={drop}
                  alt={'eau'}
                  score={cardDropScore}
                  setScore={setCardDropScore}
                />

                <Counter
                  img={move}
                  alt={'déplacement'}
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
                  alt={'déplacement'}
                  score={treeMoveScore}
                  setScore={setTreeMoveScore}
                />

                <Counter
                  score={lotusTreeScore}
                  setScore={setLotusTreeScore}
                  img={lotusWhite}
                  alt="lotus"
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
                    setLotusTreeScore(0);
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

      <div className="ResourceCounter__total">
        {/* Resources */}
        <div className="ResourceCounter__total-res flex justify-evenly py-1">
          <ResourceTotal
            score={cardPlantScore + treePlantScore}
            img={plant}
            alt="plante"
          />
          <ResourceTotal
            score={cardSunScore + treeSunScore}
            img={sun}
            alt="soleil"
          />
          <ResourceTotal
            score={cardDropScore + treeDropScore}
            img={drop}
            alt="eau"
          />
          <ResourceTotal
            score={cardMoveScore + treeMoveScore}
            img={move}
            alt="déplacement"
          />
        </div>

        {/* Win conditions */}
        <div className="ResourceCounter__total-win flex justify-evenly py-1">
          <Counter
            score={treeScore}
            setScore={setTreeScore}
            img={tree}
            alt="arbre"
          />
          <Counter
            score={fireScore}
            setScore={setFireScore}
            img={fire}
            alt="feu"
          />
          <Counter
            score={lotusScore + lotusTreeScore}
            setScore={setLotusScore}
            img={lotus}
            alt="lotus"
          />
        </div>
      </div>
    </>
  );
};

export default ResourceCounter;
