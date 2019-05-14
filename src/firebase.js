import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';

const firebaseConfig = {
  projectId: FIREBASE_PROJECT_ID,
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
};

// check if all values are provided
if (!Object.values(firebaseConfig).every(x => x)) {
  throw new Error(`Firebase config incomplete; environment vars missing for: \
    ${!FIREBASE_PROJECT_ID ? '\n   FIREBASE_PROJECT_ID' : ''} \
    ${!FIREBASE_API_KEY ? '\n   FIREBASE_API_KEY' : ''} \
    ${!FIREBASE_AUTH_DOMAIN ? '\n   FIREBASE_AUTH_DOMAIN' : ''}. \
    \nYou can find these values in your firebase console at https://console.firebase.google.com/`);
}

firebase.initializeApp(firebaseConfig);
export default firebase;
