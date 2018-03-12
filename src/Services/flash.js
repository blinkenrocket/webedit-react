// @flow
import createAudioContext from 'ios-safe-audio-context';
import Modem from './modem';
import ModemLegacy from './modemLegacy';
import type { Animation } from 'Reducer';
import type { Map } from 'immutable';

var transferActive = 0;
var audioCtx: AudioContext = createAudioContext(48000);

export default function transfer(animations: Map<string, Animation>) {
  if (transferActive === 1) {
    console.log("did not start transfer because already running!");
    return;
  }
  transferActive = 1;
  setTimeout(() => (transferActive = 0), 4000);   // iOS workaround!

  // get data signals for the legacy firmware
  let modem = new ModemLegacy(animations);
  let data = modem.generateAudio();

  // get data signals for the v2 firmware
  let modem2 = new Modem(animations);
  let data2 = modem2.generateAudio();

  playTone(Float32Concat(data2, data));
}

window.playTone = function(array) {
  array = array || window.lastArray;
  window.lastArray = array;

  var buffer = audioCtx.createBuffer(1, array.length, 48000);
  buffer.getChannelData(0).set(array);

  var source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);

  source.onended = () => {
    transferActive = 0; // not reliably reached in iOS !?
  };
  source.start(0);
};

window.startTest = function (interval) {
  stopTest();
  interval = interval || 3500;
  window.intervalHandler = setInterval(function() {
    playTone()
  }, interval);
};

window.stopTest = function () {
  clearInterval(window.intervalHandler);
};

function Float32Concat(first, second) {
  var result = new Float32Array(first.length + second.length);
  result.set(first);
  result.set(second, first.length);

  return result;
}

//starting looped silence (tone with values "0") in the background
//this improves the reliability of data transmission on some hardware platforms (stabilizing sound gain ?!)
startSilence();
function startSilence() {
  let audioSilence: AudioContext = createAudioContext(48000);
  let emptyArray = _.fill(new Array(48000), 0);
  let buffer = audioSilence.createBuffer(1, emptyArray.length, 48000);
  buffer.getChannelData(0).set(emptyArray);
  let source = audioSilence.createBufferSource();
  source.connect(audioSilence.destination);
  source.buffer = buffer;
  source.loop = true;
  source.start(0);
}
