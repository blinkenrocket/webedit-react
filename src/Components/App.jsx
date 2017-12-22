// @flow
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import { Style, StyleRoot } from 'radium';
import GlobalCSS from './Global.CSS.js';
import PropTypes from 'prop-types';
import React from 'react';
import reducer from 'Reducer';
import reduxPromise from 'redux-promise';

const store = (global.store = compose(
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
/* eslint-enable */

const Webedit = require('./Webedit').default;
const addAnimation = require('../Actions/animations').addAnimation;

export default class App extends React.Component<any> {
  static childContextTypes = {
    store: PropTypes.any,
  };
  getChildContext(): Object {
    /* If an encoded animation is passed via the URL, try to decode and import
     * it to the local application state
     */
    const encodedAnimation = this.props.location.query.s;

    if (encodedAnimation) {
      const decodedAnimation = JSON.parse(atob(encodedAnimation));

      addAnimation(decodedAnimation);
    }

    return {
      store,
    };
  }
  render() {
    return (
      <StyleRoot>
        <Style rules={GlobalCSS} />
        <Provider store={store}>
          <Webedit />
        </Provider>
      </StyleRoot>
    );
  }
}
