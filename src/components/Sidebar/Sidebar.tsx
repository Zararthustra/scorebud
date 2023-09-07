import { useContext, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  IconReset,
  IconSidebarClose,
  IconSidebarOpen,
  IconTable,
  logo
} from '@assets/index';
import { clearLS } from '@services/localStorageService';

import './Sidebar.scss';

interface ISidebarProps {
  isOpenSidebar: boolean;
  setIsOpenSidebar: (value: boolean) => void;
}

const Sidebar = ({ isOpenSidebar, setIsOpenSidebar }: ISidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery({ query: '(max-width: 800px)' });

  const handleReset = () => {
    clearLS();
    navigate(0);
  };

  useEffect(() => {
    if (isMobile) setIsOpenSidebar(false);
  }, [location.pathname]);

  if (isMobile && !isOpenSidebar)
    return (
      <div className="sidebar-mobile flex justify-between align-end">
        <IconSidebarOpen
          size={35}
          className="sidebar__icon"
          onClick={() => setIsOpenSidebar(!isOpenSidebar)}
        />
        <h1 className="sidebar-mobile__title">Scorebud</h1>
      </div>
    );

  return (
    <div
      onClick={() => !isOpenSidebar && setIsOpenSidebar(true)}
      className={
        isOpenSidebar ? 'sidebar sidebar--open' : 'sidebar sidebar--close'
      }>
      <div
        className={
          isOpenSidebar
            ? 'sidebar-items sidebar-items--open flex-col pb-1'
            : 'sidebar-items sidebar-items--close flex-col align-center pb-1'
        }>
        {/* Closed */}
        {!isOpenSidebar && (
          <>
            <IconSidebarOpen
              size={35}
              className="sidebar__icon mt-1"
              onClick={() => setIsOpenSidebar(!isOpenSidebar)}
            />
            <div
              className="flex-col justify-between align-center mt-2"
              style={{ height: '100%' }}>
              <div className="flex-col gap-1 align-center">
                {/* Score */}
                <div className={location.pathname === '/' ? 'active-item' : ''}>
                  <IconTable
                    size={40}
                    className="sidebar__icon-item"
                    onClick={() => navigate('/')}
                  />
                </div>

                {/* Parameters */}
                {/* <div
                  className={
                    location.pathname === '/parametres' ? 'active-item' : ''
                  }>
                  <IconParameter
                    width={40}
                    height={30}
                    className="sidebar__icon-item"
                    onClick={() => navigate('/parametres')}
                  />
                </div> */}
              </div>

              {/* Reset */}
              <IconReset
                size={35}
                className="sidebar__icon-logout"
                onClick={handleReset}
              />
            </div>
          </>
        )}

        {/* Open */}
        {isOpenSidebar && (
          <>
            <div className="flex justify-between mt-1 mr-1">
              <img src={logo} alt="Logo Scorebud" className="sidebar__logo" />

              <IconSidebarClose
                size={35}
                className="sidebar__icon"
                onClick={() => setIsOpenSidebar(!isOpenSidebar)}
              />
            </div>
            <div
              className="flex-col justify-between mt-2"
              style={{ height: '100%' }}>
              <div className="flex-col gap-1">
                {/* Score */}
                <div className="sidebar__item">
                  <div
                    className={location.pathname === '/' ? 'active-item' : ''}>
                    <IconTable
                      size={40}
                      className="sidebar__icon-item"
                      onClick={() => navigate('/')}
                    />
                  </div>
                  <Link className="sidebar__link" to="/">
                    Scores
                  </Link>
                </div>

                {/* Parameters */}
                {/* <div className="sidebar__item">
                  <div
                    className={
                      location.pathname === '/parametres' ? 'active-item' : ''
                    }>
                    <IconParameter
                      width={40}
                      height={30}
                      className="sidebar__icon-item"
                      onClick={() => navigate('/parametres')}
                    />
                  </div>
                  <Link className="sidebar__link" to="/parametres">
                    Paramètres
                  </Link>
                </div> */}
              </div>

              {/* Reset */}
              <div className="sidebar__item">
                <IconReset
                  size={35}
                  className="sidebar__icon-logout"
                  onClick={handleReset}
                />
                <div className="sidebar__link" onClick={handleReset}>
                  Reset
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
