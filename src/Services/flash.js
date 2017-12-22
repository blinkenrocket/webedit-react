// @flow
import createAudioContext from 'ios-safe-audio-context';
import Modem from './modem';
import ModemLegacy from './modemLegacy';
import type { Animation } from 'Reducer';
import type { Map } from 'immutable';
let transferActive = 0;

export default function transfer(animations: Map<string, Animation>) {
  if (transferActive === 1) {
    return;
  }
  transferActive = 1;
  setTimeout(() => (transferActive = 0), 2000);
  const audioCtx: AudioContext = createAudioContext(48000);

  // get data signals for the legacy firmware
  const modem = new ModemLegacy(animations);
  const data = modem.generateAudio();

  // // get data signals for the v2 firmware
  const modem2 = new Modem(animations);
  const data2 = modem2.generateAudio();
  const buffer = audioCtx.createBuffer(1, data.length + data2.length, 48000);

  const clippedData = data.subarray(0, Math.min(data.length, buffer.length));
  const clippedData2 = data2.subarray(0, Math.min(data2.length, buffer.length - data.length));

  buffer.getChannelData(0).set(clippedData);
  buffer.getChannelData(0).set(clippedData2, data.length);

  const source = audioCtx.createBufferSource();

  window.buffer = buffer;

  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.onended = () => {
    transferActive = 0;
  };
  source.start(0);
}
