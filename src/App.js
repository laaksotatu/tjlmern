import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import Users from './pages/Users';
import Projects from './pages/Projects';
import NewProject from './pages/NewProject';
import NavPrimary from './components/NavPrimary';
import UserProjects from './pages/UserProjects';
import UpdateProject from './pages/UpdateProject';
import LogIn from './pages/LogIn';
import { AuthContext } from './context/authContext';

let autoLogoutTimer;

function App() {
  const [token, setToken] = useState(false);
  const [tokenExpirationTime, setTokenExpirationTime] = useState();
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, token, expirationTime) => {
    setToken(token);
    setUserId(uid);
    const expireToken =
      expirationTime || new Date(new Date().getTime() + 7200000);
    setTokenExpirationTime(expireToken);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: expireToken.toISOString(),
      })
    );
  }, []);
  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationTime(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if (token && tokenExpirationTime) {
      const timeRemaining =
        tokenExpirationTime.getTime() - new Date().getTime();
      autoLogoutTimer = setTimeout(logout, timeRemaining);
    } else {
      clearTimeout(autoLogoutTimer);
    }
  }, [token, logout, tokenExpirationTime]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  let validRoutes;

  if (token) {
    validRoutes = (
      <Switch>
        <Route path='/users/all' exact>
          <Users />
        </Route>
        <Route path='/projects/all' exact>
          <Projects />
        </Route>
        <Route path='/:userId/projects' exact>
          <UserProjects />
        </Route>
        <Route path='/projects/new' exact>
          <NewProject />
        </Route>
        <Route path='/projects/:projectId'>
          <UpdateProject />
        </Route>
        <Redirect to='/projects/all' />
      </Switch>
    );
  } else {
    validRoutes = (
      <Switch>
        <Route path='/users/all' exact>
          <Users />
        </Route>
        <Route path='/projects/all' exact>
          <Projects />
        </Route>
        <Route path='/:userId/projects' exact>
          <UserProjects />
        </Route>
        <Route path='/login'>
          <LogIn />
        </Route>
        <Redirect to='/login' />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <BrowserRouter>
        <NavPrimary />
        <main>{validRoutes}</main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
