/* @flow */
import { browserHistory, Route, Router } from 'react-router';
import Webedit from 'Components/Webedit';
import PublicGallery from 'Components/PublicGallery';
import React from 'react';

export default (
  <Router history={browserHistory}>
    <Route path="/gallery" component={PublicGallery} />
    <Route path="/(:animationId)" component={Webedit} />
  </Router>
);
