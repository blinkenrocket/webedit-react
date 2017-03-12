// @flow
import type { Map } from 'immutable';
import ModemLegacy from './modemLegacy';
import Modem from './modem';
import { Waud, WaudSound } from 'waud.js';
let transferActive = 0;

export function transfer(animations: Map<string, Animation>) {
  if (transferActive === 1) {
     return; 
  }
  transferActive = 1;
  // First, send data signals for the legacy firmware
  console.log('waud', Waud);
  Waud.init();
  //const audioCtx = new AudioContext();

  console.log('hop', Waud);
 const snd = new WaudSound('https://raw.githubusercontent.com/waud/waud/dev/sample/assets/bell.mp3', { autoplay: false, loop: false, volume: 0.99, onload: playSound });
  // const snd = new WaudSound('data:audio/wave;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==', { autoplay: false, loop: false, volume: 0.5, onload: playSound });  
  function playSound() {
    console.log('playsnd', Waud);
    snd.play();
    transferActive = 0;
    window.document.createElement('audio');

  const audioCtx = Waud.audioManager.audioContext;

  const modem = new ModemLegacy(animations);
  const data = modem.generateAudio();
  const buffer = audioCtx.createBuffer(1, data.length, 48000);
  buffer.copyToChannel(data, 0);
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);

  // Afterwards, send data signals for the v2 firmware
  source.onended = function() {
    const modem2 = new Modem(animations);
    const data2 = modem2.generateAudio();
    const buffer2 = audioCtx.createBuffer(1, data2.length, 48000);
    buffer2.copyToChannel(data2, 0);
    const source2 = audioCtx.createBufferSource();
    source2.buffer = buffer2;    
    source2.connect(audioCtx.destination);
    source2.onended = function() {
      // audioCtx.close();
      transferActive = 0;
    };
    source2.start();
  };
  source.start();
  }
}
