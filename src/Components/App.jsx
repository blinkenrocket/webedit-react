/* @flow */
import { createStore, bindActionCreators, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { StyleRoot, Style } from 'radium';
import GlobalCSS from './Global.CSS.js';
import React from 'react';
import reduxPromise from 'redux-promise';

const reduxActions = require('redux-actions');
reduxActions.handleActions = (function(old) {
  return function(reducerMap: Object, ...rest) {
    Object.keys(reducerMap).forEach((key) => {
      const oldReducerFunction = reducerMap[key];
      reducerMap[key] = function(state, action) {
        const newState = oldReducerFunction(state, action);
        return {
          ...state,
          ...newState,
        };
      };
    });
    return old.call(this, reducerMap, ...rest);
  };
}(reduxActions.handleActions));
const reducer = require('../Reducer').default;

const store = global.store = compose(
  applyMiddleware(reduxPromise),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)(reducer);

/* eslint-disable */
if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('../Reducer', () => {
    const nextRootReducer = require('../Reducer/index');
    store.replaceReducer(nextRootReducer);
  });
}
/* eslint-enable */

reduxActions.createAction = (function(old) {
  return function(...args) {
    const action = (old: any).apply(this, args);
    return bindActionCreators(action, store.dispatch);
  };
}(reduxActions.createAction));

const Webedit = require('./Webedit').default;
const addAnimation = require('../Actions/animations').addAnimation;
export default class App extends React.Component {
  static childContextTypes = {
    store: React.PropTypes.any,
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
        <Style rules={GlobalCSS}/>
        <Provider store={store}>
          <Webedit/>
        </Provider>
      </StyleRoot>
    );
  }
}
