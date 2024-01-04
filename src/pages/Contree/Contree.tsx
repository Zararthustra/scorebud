import { useState } from 'react';

import { getLS } from '@services/localStorageService';
import { ContreeCounter, Setup } from '@components/index';

import './Contree.scss';
import { Tabs } from 'antd';
import { contreePoints } from '@assets/index';

const Contree = () => {
  const [setup, setSetup] = useState<string>(getLS('contree'));

  if (!!!setup)
    return (
      <>
        <div className="Contree pb-5 px-1">
          <h1 className="mt-5">La Belote Contrée</h1>
          <Tabs
            defaultActiveKey="1"
            size="small"
            className="Contree__tabs"
            items={[
              {
                label: 'Calcul',
                key: '1',
                children: (
                  <div className="mt-1">
                    <Setup setSetup={setSetup} />
                  </div>
                )
              },
              {
                label: 'Points',
                key: '2',
                children: (
                  <div className="mt-1">
                    <img
                      className="Contree__img"
                      src={contreePoints}
                      alt="Valeur des cartes"
                    />
                  </div>
                )
              }
            ]}
          />
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
