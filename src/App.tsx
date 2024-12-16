import './App.css';
import { Outlet, useLocation } from 'react-router-dom';
import { Navigation, UserInfo } from './components';
import { useAuth } from './app/useAuth';

function App() {
  const { isAuthenticated } = useAuth({});
  const location = useLocation();

  // Define the paths where only the Outlet should be displayed
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
              {isAuthenticated ? (
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
