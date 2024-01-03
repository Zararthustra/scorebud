import { useState } from 'react';

import { IconClub, IconDiamond, IconHeart, IconSpade } from '@assets/index';

import './Card.scss';

interface ICardProps {
  value: string;
  trump?: 'diamond' | 'spade' | 'heart' | 'club' | '';
  points: number[];
  setPoints: (value: number[]) => void;
}
const Card = ({ value, trump, points, setPoints }: ICardProps) => {
  const [clicked, setClicked] = useState<boolean>(false);

  const getTrumpIcon = () => {
    switch (trump) {
      case 'diamond':
        return <IconDiamond width={15} height={15} />;
      case 'spade':
        return <IconSpade width={15} height={15} />;
      case 'heart':
        return <IconHeart width={15} height={15} />;
      case 'club':
        return <IconClub width={15} height={15} />;
      case '':
        return '!!';

      default:
        break;
    }
  };

  const handleTrumpCounter = () => {
    switch (value) {
      case 'V':
        setPoints([...points, 20]);
        break;
      case '9':
        setPoints([...points, 14]);
        break;
      case 'A':
        setPoints([...points, 11]);
        break;
      case '10':
        setPoints([...points, 10]);
        break;
      case 'R':
        setPoints([...points, 4]);
        break;
      case 'D':
        setPoints([...points, 3]);
        break;

      default:
        break;
    }
  };
  const handleDefaultCounter = () => {
    switch (value) {
      case 'A':
        setPoints([...points, 11]);
        break;
      case '10':
        setPoints([...points, 10]);
        break;
      case 'R':
        setPoints([...points, 4]);
        break;
      case 'D':
        setPoints([...points, 3]);
        break;
      case 'V':
        setPoints([...points, 2]);
        break;

      default:
        break;
    }
  };

  const handleClick = () => {
    if (clicked) return;
    navigator.vibrate(50);
    if (!!trump) {
      handleTrumpCounter();
      setClicked(true);
    } else handleDefaultCounter();
  };

  return (
    <div
      className={'Card' + (clicked && !!trump ? ' Card--disabled' : '')}
      onClick={handleClick}>
      {trump && <div className="Card__trump">{getTrumpIcon()}</div>}
      <p style={!!trump ? { marginTop: '1rem' } : {}}>{value}</p>
    </div>
  );
};

export default Card;
