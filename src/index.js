/* @flow */
import './vendor';
import ReactDOM from 'react-dom';
import routes from './routes';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(routes, document.querySelector('#webedit'));	
});
