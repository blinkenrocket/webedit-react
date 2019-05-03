/* @flow */
import { browserHistory, Route, Router } from 'react-router';
import Webedit from 'Components/Webedit';
import React from 'react';

export default (
  <Router history={browserHistory}>
    <Route path="/(:animationId)" component={Webedit} />
  </Router>
);
