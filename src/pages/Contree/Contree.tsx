import { useState } from 'react';

import { getLS } from '@services/localStorageService';
import { ContreeCounter, Setup } from '@components/index';

import './Contree.scss';

const Contree = () => {
  const [setup, setSetup] = useState<string>(getLS('contree'));

  if (!!!setup)
    return (
      <>
        <div className="Contree pb-5 px-1">
          <h1 className="mt-5">La Belote Contrée</h1>
          <Setup setSetup={setSetup} />
        </div>
      </>
    );
  return (
    <>
      <div className="Contree pb-5 px-1">
        <h1 className="mt-5">Calcul {getLS('calculate')}</h1>
        <ContreeCounter setup={JSON.parse(setup)} setSetup={setSetup} />
      </div>
    </>
  );
};
export default Contree;
