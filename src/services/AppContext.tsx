import { createContext } from 'react';

export interface IAppContext {
  themeColor: string;
  setThemeColor: (value: string) => void;
}

const AppContext = createContext<IAppContext>({
  themeColor: '#000',
  setThemeColor: () => null
});

export default AppContext;
