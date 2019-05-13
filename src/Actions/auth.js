/* @flow */
import { createAction } from 'redux-actions';
import { Map } from 'immutable';
import { DB, saveAnimationsToRemote, mapAnimationToLocal } from '../db';

export const loggedIn = createAction('LOGIN', async (uid) => {
  const info = await DB.collection('users').doc(uid).get();
  return { uid, admin: info.data()['admin'] || false };
});
export const loggedOut = createAction('LOGOUT');


export const syncLibrary = createAction('UPSERT_ANIMATIONS', async (uid, localLib) => {
  // fetch remote Library and convert to local schema, i.e. Map<animationId, animation>
  const animations = await DB.collection('users').doc(uid).collection('animations').get();
  const remoteLib = animations.docs.reduce((acc, cur) => (
    acc.set(cur.id, mapAnimationToLocal(cur.data()))
  ), Map());

  // store all remote animations locally
  remoteLib.map(animation => { 
    localStorage.setItem(`animation:${animation.id}`, JSON.stringify(animation));
  })

  // save new, unsaved animations from localLib to the cloud
  const localUnsynced = localLib.filterNot((_, key) => remoteLib.has(key)).filterNot(a => a.text === 'blinkenrocket.com');
  saveAnimationsToRemote(uid, localUnsynced);
  return remoteLib;
});

export const signedUp = createAction('LOGIN', (uid, localLib) => {
  const lib = localLib.filterNot(a => a.text === 'blinkenrocket.com');
  //TODO add more signup context. last login referrer etc
  DB.collection('users').doc(uid).set({active: true }, {merge: true});
  saveAnimationsToRemote(uid, lib);
  return { uid, admin: false };
});
//
