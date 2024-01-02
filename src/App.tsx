import frFR from 'antd/locale/fr_FR';
import { ConfigProvider, App as AntApp } from 'antd';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AppWrapper from '@services/AppWrapper';
import { Contree, LivingForest, Rules, Score } from '@pages/index';
import { Dice, ModalReloadSW } from '@components/index';

const App = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegistered(r: any) {
      // eslint-disable-next-line prefer-template
      console.log('SW Registered');
    },
    onRegisterError(error: any) {
      console.log('SW registration error', error);
    }
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <ConfigProvider
      locale={frFR}
      theme={{
        token: { colorPrimary: '#b24592', borderRadius: 3 },
        components: {
          Tabs: {
            horizontalMargin: '0'
          }
        }
      }}>
      <AntApp>
        <BrowserRouter>
          <ModalReloadSW
            offlineReady={offlineReady}
            needRefresh={needRefresh}
            close={close}
            updateServiceWorker={updateServiceWorker}
          />
          <Routes>
            <Route element={<AppWrapper />}>
              <Route element={<Score />} path="/" />
              <Route element={<Dice />} path="/dice" />
              <Route element={<Rules />} path="/regles" />
              <Route element={<LivingForest />} path="/living-forest" />
              <Route element={<Contree />} path="/belote-contree" />
            </Route>
          </Routes>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
};

export default App;
