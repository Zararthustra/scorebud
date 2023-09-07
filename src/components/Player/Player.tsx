import './Player.scss';

interface IPlayerProps {
  name: string;
  selectedPlayer?: string;
  onClick?: () => void;
}

const Player = ({ name, selectedPlayer, onClick }: IPlayerProps) => (
  <p
    className={`Player${selectedPlayer === name ? '--selected' : ''}`}
    onClick={onClick}>
    {name}
  </p>
);

export default Player;
