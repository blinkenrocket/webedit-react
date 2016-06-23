/* @flow */
import { createAction } from 'redux-actions';
import UUID from 'uuid-js';
import { t } from 'i18next';
import { List } from 'immutable';
import { range } from 'lodash';

const EMPTY_DATA = List(range(8).map(() => 0x00));

export const addNewAnimation = createAction('ADD_ANIMATION', (type: string) => ({
  delay: 0,
  direction: 0,
  id: UUID.create().toString(),
  name: t('animation.new', { type: t(`animation.${type}`) }),
  speed: 13,
  creationDate: Math.floor(new Date() / 1000),
  type,
  animation: { data: EMPTY_DATA, currentFrame: 0, frames: 1, length: 1 },
}));

export const addAnimation = createAction('ADD_ANIMATION', (animation: Animation) => animation);

export const selectAnimation = createAction('SELECT_ANIMATION', (animation: Animation) => animation);

export const updateAnimation = createAction('UPDATE_ANIMATION', (animation: Animation) => animation);

export const removeAnimation = createAction('REMOVE_ANIMATION', (animationId: string) => animationId);

export const reset = createAction('RESET');
