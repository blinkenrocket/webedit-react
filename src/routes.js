/* @flow */
import { browserHistory, Route, Router } from 'react-router';
import Webedit from 'Components/Webedit';
import PublicGallery from 'Components/PublicGallery';
import AdminGallery from 'Components/AdminGallery';
import React from 'react';

export default (
  <Router history={browserHistory}>
    <Route path={`${BASE_URL}/gallery`} component={PublicGallery} />
    <Route path={`${BASE_URL}/gallery/admin`} component={AdminGallery} />
    <Route path={`${BASE_URL}/(:animationId)`} component={Webedit} />
  </Router>
);
