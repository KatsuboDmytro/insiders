import './App.css';
import { Outlet, useLocation } from 'react-router-dom';
import { Navigation, UserInfo } from './components';
import { useAppSelector } from './app/hooks';

function App() {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const hiddenPaths = ['/login', '/signup'];
  const shouldHideLayout = hiddenPaths.includes(location.pathname);

  return (
    <>
      {shouldHideLayout ? (
          <Outlet />
        ) : (
          <div className="dashboard">
            <Navigation />
            <div className="dashboard__content">
              <UserInfo />
              {user ? (
                <Outlet />
              ) : (
                <div>You may firstly auth...</div>
              )}
            </div>
          </div>
        )}
    </>
  );
}

export default App;
