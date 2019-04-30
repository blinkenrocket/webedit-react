/* @flow */
import { createAction } from 'redux-actions';

export const loggedIn = createAction('LOGIN', fireUser => fireUser['uid'])
export const loggedOut = createAction('LOGOUT');
