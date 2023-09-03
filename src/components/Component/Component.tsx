import { useState } from 'react';

import './Component.scss';

interface IComponentProps {
  hello: string;
}

const Component = ({ hello }: IComponentProps) => {
  const [world, setWorld] = useState('world');

  return (
    <div className="component flex justify-center gap-1 my-2 p-1">
      <p className="component__hello">{hello}</p>
      <p className="component__world" onClick={() => setWorld('goodbye')}>
        {world}
      </p>
    </div>
  );
};

export default Component;
