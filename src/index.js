/* @flow */
import './vendor';
import ReactDOM from 'react-dom';
import routes from './routes';

setTimeout(() => {
  ReactDOM.render(routes, document.querySelector('#webedit'));
}, 500);
