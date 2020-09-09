import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Iag } from './components/Iag/IagScreen';
import { Login } from './components/Login/LoginScreen';

export const App: React.FC = () => {
  
  return (
    <Router>
      <Switch>
        <Route exact={true} path='/login'>
          <Login />
        </Route>

        <Route path='/'>
          <Iag/>
        </Route>

      </Switch>
    </Router>
  );
}