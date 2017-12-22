/* @flow */
import './i18n';
import './vendor';
import ReactDOM from 'react-dom';
import routes from './routes';

document.addEventListener('DOMContentLoaded', () => {
  // $FlowFixMe
  ReactDOM.render(routes, document.querySelector('#webedit'));
});
