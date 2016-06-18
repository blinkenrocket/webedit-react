/* @flow */
import { Router, Route, browserHistory } from 'react-router';
import App from 'Components/App';
import React from 'react';

export default (
  <Router history={browserHistory}>
    <Route path={BASE_URL} component={App}/>
    <Route path={`${BASE_URL}:encodedAnimation`} component={App}/>
  </Router>
);
