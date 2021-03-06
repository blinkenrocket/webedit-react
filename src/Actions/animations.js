/* @flow */
import { createAction } from 'redux-actions';
import { List } from 'immutable';
import { range } from 'lodash';
import { Map } from 'immutable';
import { t } from 'i18next';
import UUID from 'uuid-js';
import type { Animation } from 'Reducer';
import { saveAnimationsToRemote, removeAnimationRemote } from '../db';

const EMPTY_DATA = List(range(8).map(() => 0x00));


export const newAnimation = (type: string, defaulttext?: string) => ({
  delay: 0,
  repeat: 0,
  direction: 0,
  id: UUID.create().toString(),
  //name: t('animation.new', { type: t(`animation.${type}`) }),
  name: '',
  speed: 13,
  creationDate: Math.floor(new Date() / 1000),
  type,
  text: defaulttext,
  animation: { data: EMPTY_DATA, currentFrame: 0, frames: 1, length: 1 },
});

export const addAnimation = createAction('ADD_ANIMATION', (animation: Animation, uid: string) => {
  localStorage.setItem(`animation:${animation.id}`, JSON.stringify(animation));
  // store remotely
  if (uid) {
    saveAnimationsToRemote(uid, new Map({[animation.id]: animation}));
  }
  return animation;
});

export const updateAnimation = createAction('UPDATE_ANIMATION', (animation: Animation, uid: string) => {
  // inject modification date
  animation = Object.assign({}, animation, { modifiedAt: new Date() })

  // store locally
  localStorage.setItem(`animation:${animation.id}`, JSON.stringify(animation));

  // store remotely
  if (uid) {
    saveAnimationsToRemote(uid, new Map({[animation.id]: animation}));
  }
  return animation;
});

export const removeAnimation = createAction('REMOVE_ANIMATION', (animationId: string, uid: string) => {
  localStorage.removeItem(`animation:${animationId}`);

  if (uid) {
    removeAnimationRemote(uid, animationId);
  }
  return animationId;
});

export const reset = createAction('RESET');
