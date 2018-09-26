import firebase from 'react-native-firebase';
import ReduxSagaFirebase from 'redux-saga-firebase'
import Secrets from 'react-native-config'
// const firebaseApp = firebase.initializeApp({
//   apiKey: Secrets.FIRE_API_KEY,
//   authDomain: Secrets.FIRE_AUTH_DOMAIN,
//   databaseURL: Secrets.FIRE_DB_URL,
//   projectId: Secrets.FIRE_PROJ_ID,
//   storageBucket: Secrets.FIRE_STORAGE_BUCKET,
//   messagingSenderId: '994318427763'
// })

const rsf = new ReduxSagaFirebase(firebase.app())

export default rsf