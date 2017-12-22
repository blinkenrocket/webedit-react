/* @flow */
import { browserHistory, Route, Router } from 'react-router';
import App from 'Components/App';
import React from 'react';

export default (
  <Router history={browserHistory}>
    <Route path={BASE_URL} component={App} />
  </Router>
);
