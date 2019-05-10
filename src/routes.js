/* @flow */
import { browserHistory, Route, Router } from 'react-router';
import Webedit from 'Components/Webedit';
import PublicGallery from 'Components/PublicGallery';
import AdminGallery from 'Components/AdminGallery';
import React from 'react';

export default (
  <Router history={browserHistory}>
    <Route path="/gallery" component={PublicGallery} />
    <Route path="/gallery/admin" component={AdminGallery} />
    <Route path="/(:animationId)" component={Webedit} />
  </Router>
);
