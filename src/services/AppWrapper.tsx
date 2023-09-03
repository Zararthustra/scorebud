import { App } from 'antd';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { Sidebar } from '@components/index';
import AppContext, { IAppContext } from '@services/AppContext';

const AppWrapper = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);
  const [themeColor, setThemeColor] = useState<string>('#0f0');

  return (
    <AppContext.Provider value={{ themeColor, setThemeColor }}>
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
