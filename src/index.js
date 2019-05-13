/* @flow */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import reduxPromise from 'redux-promise';
import { applyMiddleware, compose, createStore } from 'redux';
import { Style, StyleRoot } from 'radium';
import GlobalCSS from 'Components/Global.CSS.js';
import './db';
import './i18n';
import './vendor';
import { FirebaseAuthProvider, } from '@react-firebase/auth';
import firebase from 'firebase';

import reducer from 'Reducer';
import routes from './routes';

export const store = (global.store = compose(
  applyMiddleware(reduxPromise),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)(reducer));

/* eslint-disable */
if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  // $FlowFixMe
  module.hot.accept('../Reducer', () => {
    const nextRootReducer = require('../Reducer/index').default;
    store.replaceReducer(nextRootReducer);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // $FlowFixMe
  ReactDOM.render(
      <StyleRoot>
        <Style rules={GlobalCSS} />
        <FirebaseAuthProvider firebase={firebase} >
          <Provider store={store}>
            { routes }
          </Provider>
        </FirebaseAuthProvider>
      </StyleRoot>
    , document.querySelector('#app'));
});
