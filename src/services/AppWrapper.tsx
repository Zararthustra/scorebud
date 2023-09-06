import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { Sidebar } from '@components/index';
import { IPlayer } from '@interfaces/index';
import AppContext, { IAppContext } from '@services/AppContext';
import { getLS } from './localStorageService';

const AppWrapper = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);
  const [players, setPlayers] = useState<IPlayer[]>(
    JSON.parse(getLS('players') || '[]')
  );

  return (
    <AppContext.Provider value={{ players, setPlayers }}>
      <div className="flex">
        <Sidebar
          isOpenSidebar={isOpenSidebar}
          setIsOpenSidebar={setIsOpenSidebar}
        />
        <div onClick={() => setIsOpenSidebar(false)} className="w-100">
          <Outlet />
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default AppWrapper;
