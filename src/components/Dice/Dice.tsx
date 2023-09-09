import { useState } from 'react';

import { Button } from '@components/index';

import './Dice.scss';

const Dice = () => {
  const [dice, rollDice] = useState<number>(4);
  const random = () => Math.floor(Math.random() * 6) + 1;

  return (
    <div className="flex-col align-center justify-center mt-5">
      <div className="dice">
        <ol className="die-list" data-roll={dice} id="die-1">
          <li className="die-item" data-side="1">
            <span className="dot"></span>
          </li>
          <li className="die-item" data-side="2">
            <span className="dot"></span>
            <span className="dot"></span>
          </li>
          <li className="die-item" data-side="3">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </li>
          <li className="die-item" data-side="4">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </li>
          <li className="die-item" data-side="5">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </li>
          <li className="die-item" data-side="6">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </li>
        </ol>
      </div>

      <Button
        primary
        onClick={() => rollDice(random())}
        className="my-2 px-2"
        style={{ fontWeight: 600 }}>
        Lancer le dé
      </Button>
    </div>
  );
};
export default Dice;
