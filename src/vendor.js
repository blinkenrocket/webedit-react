// @flow

import 'babel-polyfill';
import './external/babelHelper.js';
import '@mohayonao/web-audio-api-shim';
import BluebirdPromise from 'bluebird';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();


require('./external/Roboto.css');
require('font-awesome/css/font-awesome.css');

global.Promise = BluebirdPromise;
global.AudioContext = global.AudioContext || global.webkitAudioContext;
