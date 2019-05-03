import firebase from 'firebase/app';
import { List } from 'immutable';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';

//TODO(flo) document publicAnimations and user.animations and overall firebase schema

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export const DB = firebase.firestore();


export const saveAnimationsToRemote = (uid, library) => {
  const user = DB.collection('users').doc(uid);
  library.map(mapAnimationToRemote)
    .map(animation => { console.table('saving ', animation); user.collection('animations').doc(animation.id).set(animation); });
}

export const removeAnimationRemote = (uid, animationId) => {
  DB.collection('users').doc(uid).collection('animations').doc(animationId).delete()
}

export const mapAnimationToLocal = (doc) => {
  const frames = (doc.type === 'pixel') ? (doc.columns.length / 8) : 0;
  const result = {
    id: doc.id,
    name: doc.name,
    type: doc.type,
    text: doc.text,
    delay: doc.delay,
    repeat: doc.repeat,
    direction: doc.direction,
    speed: doc.speed,
    creationDate: doc.createdAt.seconds,
    animation: { 
      data: List(doc.columns),
      currentFrame: 0, 
      frames: frames,
      length: frames,
    },
  }
  if (doc.originalId) {
    // only publicAnimations have this property
    result['originalId'] = doc.originalId;
  }
  if (doc.author) {
    // only publicAnimations have this property
    result['author'] = doc.author;
  }
  if (doc.reviewedAt) {
    // only user-animations have this property
    result['reviewedAt'] = doc.reviewedAt.seconds;
  }
  if (doc.modifiedAt) {
    // only user-animations have this property
    result['modifiedAt'] = doc.modifiedAt.seconds;
  }
  return result;
}


export const mapAnimationToRemote = (animation: Animation) => {
  const result = { 
    id: animation.id,
    name: animation.name,
    type: animation.type,
    text: animation.text || '',
    columns: animation.animation.data.toJS(),
    speed: animation.speed,
    delay: animation.delay,
    repeat: animation.repeat,
    direction: animation.direction,
    createdAt: firebase.firestore.Timestamp.fromDate(new Date(animation.creationDate * 1000)),
    uploadedAt: firebase.firestore.Timestamp.fromDate(new Date()),
  };
  if (animation.originalId) {
    // only publicAnimations have this property
    result['originalId'] = animation.originalId;
  }
  if (animation.author) {
    // only publicAnimations have this property
    result['author'] = animation.author;
  }
  if (animation.reviewedAt) {
    // only user-animations have this property
    result['reviewedAt'] = firebase.firestore.Timestamp.fromDate(new Date(animation.reviewedAt))
  }
  if (animation.modifiedAt) {
    // only user-animations have this property
    result['modifiedAt'] = firebase.firestore.Timestamp.fromDate(new Date(animation.modifiedAt))
  }
  return result;
};

