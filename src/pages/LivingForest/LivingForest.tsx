import { ResourceCounter, WinCounter } from '@components/index';

import './LivingForest.scss';

const LivingForest = () => {
  return (
    <>
      <div className="LivingForest">
        <h1 className="mt-5">Living Forest</h1>
        <ResourceCounter />
        <WinCounter />
      </div>
    </>
  );
};
export default LivingForest;
