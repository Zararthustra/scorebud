import './Counter.scss';

interface ICounterProps {
  img: string;
  alt: string;
  score: number;
  scoreToAppend?: number;
  setScore: (value: any) => void;
}

const Counter = ({
  img,
  alt,
  score,
  scoreToAppend,
  setScore
}: ICounterProps) => (
  <div className="flex-col justify-center align-center gap-05">
    <div className="Counter flex justify-center align-center">
      <p
        className="Counter__operator"
        onClick={() => {
          setScore((prev: number) => (prev -= 1));
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
          setScore((prev: number) => (prev += 1));
          navigator.vibrate(50);
        }}>
        +
      </p>
    </div>

    <p className="m-0 Counter__number">
      {!!scoreToAppend || scoreToAppend === 0 ? score + scoreToAppend : score}
    </p>
  </div>
);

export default Counter;
