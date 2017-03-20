// @flow
import type { Map } from 'immutable';
import ModemLegacy from './modemLegacy';
import Modem from './modem';
import { Waud } from 'waud.js';
let transferActive = 0;

export function transfer(animations: Map<string, Animation>) {
  if (transferActive === 1) {
     return; 
  }
  transferActive = 1;
  setTimeout(() => enableTransfer(), 2000);
  function enableTransfer() {
    transferActive = 0;
  }

  console.log('waud', Waud);
  Waud.init();
  // const audioCtx = new AudioContext();
  const audioCtx = Waud.audioContext;
  // const audioCtx = Waud.audioManager.audioContext;
  Waud.useWebAudio = true;
  Waud.preferredSampleRate = 48000;

  // get data signals for the legacy firmware
  const modem = new ModemLegacy(animations);
  const data = modem.generateAudio();

  // get data signals for the v2 firmware
  const modem2 = new Modem(animations);
  const data2 = modem2.generateAudio();
  const buffer = audioCtx.createBuffer(1, data.length + data2.length, 48000);
  buffer.copyToChannel(data, 0);
  buffer.copyToChannel(data2, 0, data.length);
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.onended = function() {
      //transferActive = 0;
      //audioCtx.close();
      Waud.destroy();
  };
  source.start();
}
