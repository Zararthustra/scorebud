interface ICounterProps {
  img: string;
  alt: string;
  score: number;
}

const ResourceTotal = ({ img, alt, score }: ICounterProps) => (
  <div className="flex-col justify-center align-center gap-05">
    <img src={img} alt={alt} />

    <p className="m-0 Counter__number">{score}</p>
  </div>
);

export default ResourceTotal;
