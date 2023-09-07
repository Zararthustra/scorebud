import './Counter.scss';

interface ICounterProps {
  img: string;
  alt: string;
  score: number;
  treeScore?: number;
  setScore: (value: number) => void;
}

const Counter = ({ img, alt, treeScore, score, setScore }: ICounterProps) => (
  <div className="flex-col justify-center align-center gap-05">
    <div className="Counter flex justify-center align-center">
      <p
        className="Counter__operator"
        onClick={() => {
          setScore((score -= 1));
          navigator.vibrate(50);
        }}>
        -
      </p>

      <div className="flex-col justify-center align-center">
        <img src={img} alt={alt} />
      </div>

      <p
        className="Counter__operator"
        onClick={() => {
          setScore((score += 1));
          navigator.vibrate(50);
        }}>
        +
      </p>
    </div>
    <p className="m-0 Counter__number">
      {treeScore ? treeScore + score : score}
    </p>
  </div>
);

export default Counter;
