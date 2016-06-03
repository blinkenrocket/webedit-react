// @flow
import type { Map } from 'immutable';
import Modem from './modem';

export function transfer(animations: Map<string, Animation>) {
  const modem = new Modem(animations);
  const data = modem.generateAudio();
  const audioCtx = new AudioContext();
  const buffer = audioCtx.createBuffer(1, data.length, 48000);
  buffer.copyToChannel(data, 0);
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.start();
  setTimeout(() => audioCtx.close(), 1000);
}
