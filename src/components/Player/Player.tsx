import './Player.scss';

interface IPlayerProps {
  name: string;
}

const Player = ({ name }: IPlayerProps) => <p className="Player">{name}</p>;

export default Player;
