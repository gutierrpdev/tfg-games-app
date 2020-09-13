import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Iag } from './components/Iag/IagScreen';
import { Login } from './components/Login/LoginScreen';

export const App: React.FC = () => {
  
  return (
    <Router>
      <Switch>
        <Route exact={true} path='/login' component={Login}/>
        <Route exact={true} path='/profile' component={Iag}/>
        <Route component={Iag} />
      </Switch>
    </Router>
  );
}