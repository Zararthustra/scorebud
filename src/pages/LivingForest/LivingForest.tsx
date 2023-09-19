import { ResourceCounter, WinCounter } from '@components/index';

import './LivingForest.scss';

const LivingForest = () => {
  return (
    <>
      <div className="LivingForest pb-5">
        <h1 className="mt-5">Living Forest</h1>
        <ResourceCounter />
        <WinCounter />
      </div>
    </>
  );
};
export default LivingForest;
