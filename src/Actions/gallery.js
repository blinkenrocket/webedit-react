/* @flow */
import { createAction } from 'redux-actions';
import UUID from 'uuid-js';
import type { Animation } from 'Reducer';
import { DB, mapAnimationToLocal, mapAnimationToRemote } from '../db';


// Public Gallery
export const loadGallery = createAction('UPSERT_GALLERY_ANIMATIONS', async () => {
  const snapshot = await DB.collection('publicAnimations').get();
  return snapshot.docs.map(a => mapAnimationToLocal(a.data()));
})

export const addAnimationToGallery = createAction('UPSERT_GALLERY_ANIMATIONS', (animation: Animation) => {
  const originalId = animation.id;
  const clone = Object.assign({}, ...animation, { 
    id: UUID.create().toString(), 
    creationDate: Math.floor(new Date() / 1000),
    modifiedAt: null,
    originalId
  });
  
  DB.collection('publicAnimations').doc(clone.id).set(mapAnimationToRemote(clone));
  return [clone];
});

export const removeAnimationFromGallery = createAction('REMOVE_GALLERY_ANIMATION', (animation: Animation) => {
  DB.collection('publicAnimations').doc(animation.id).delete();
  return animation.id;
});
export const resetGallery = createAction('RESET_GALLERY');


// Admin Gallery 
export const loadAdminGallery = createAction('UPSERT_ADMIN_GALLERY_ANIMATIONS', async () => {
  const users = await DB.collection('users').get();
  return await Promise.all(
    users.docs.map(user => 
      user.ref.collection('animations').get().then(aniSnapshot => 
        aniSnapshot.docs.map(animation => 
          mapAnimationToLocal(Object.assign(animation.data(), { author: user.id }))
        )
      )
    )
  ).then(animationLists => (
    animationLists.reduce((acc, cur) => acc.concat(cur), [])
  ));
});

export const reviewAnimation = createAction('UPSERT_ADMIN_GALLERY_ANIMATIONS', (animation: Animation, when) => {
  const updated = Object.assign({}, animation, { reviewedAt: when });
  DB.collection('users').doc(animation.author)
    .collection('animations').doc(animation.id).set({
      reviewedAt: updated.reviewedAt,
    }, { merge: true });
  return [updated];
});

