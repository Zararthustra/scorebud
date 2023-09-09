import { useContext, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  IconForest,
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

                {/* LivingForest */}
                <div
                  className={
                    location.pathname === '/living-forest' ? 'active-item' : ''
                  }>
                  <IconForest
                    width={40}
                    height={35}
                    className="sidebar__icon-item"
                    onClick={() => navigate('/living-forest')}
                  />
                </div>
              </div>

              {/* Reset */}
              <div className="flex-col align-center">
                <IconReset
                  size={30}
                  className="sidebar__icon-logout"
                  onClick={handleReset}
                />
                <p
                  className="m-0 mt-1 f-s"
                  style={{ color: 'var(--color-grey-300)' }}>
                  {APP_VERSION}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Open */}
        {isOpenSidebar && (
          <>
            <div className="flex justify-between mt-1 mr-1">
              <Link className="sidebar__link" to="/dice">
                <img src={logo} alt="Logo Scorebud" className="sidebar__logo" />
              </Link>

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

                {/* LivingForest */}
                <div className="sidebar__item">
                  <div
                    className={
                      location.pathname === '/living-forest'
                        ? 'active-item'
                        : ''
                    }>
                    <IconForest
                      width={40}
                      height={35}
                      className="sidebar__icon-item"
                      onClick={() => navigate('/living-forest')}
                    />
                  </div>
                  <Link className="sidebar__link" to="/living-forest">
                    Living Forest
                  </Link>
                </div>
              </div>

              {/* Reset */}
              <div className="flex-col">
                <div className="sidebar__item">
                  <IconReset
                    size={30}
                    className="sidebar__icon-logout"
                    onClick={handleReset}
                  />
                  <div className="sidebar__link" onClick={handleReset}>
                    Reset
                  </div>
                </div>
                <p
                  className="m-0 f-s self-end mr-1 mt-1"
                  style={{ color: 'var(--color-grey-300)' }}>
                  Version {APP_VERSION}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
