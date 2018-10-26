/* ***********************************************************
* A short word on how to use this automagically generated file.
* We're often asked in the ignite gitter channel how to connect
* to a to a third party api, so we thought we'd demonstrate - but
* you should know you can use sagas for other flow control too.
*
* Other points:
*  - You'll need to add this saga to sagas/index.js
*  - This template uses the api declared in sagas/index.js, so
*    you'll need to define a constant in that file.
*************************************************************/

import { call, put } from 'redux-saga/effects'
import LoginActions from '../Redux/LoginRedux'
import firebase from 'react-native-firebase';
import { LoginSelectors } from '../Redux/LoginRedux'
import rsf from '../Lib/FirebaseLib'

export function * getLogin (api, action) {

  let { idToken, accessToken } = action
  let response
  // make the call to the api

  console.tron.log('idToken: ', idToken)
  try {
    if(idToken === null){
      console.tron.log('FACEBOOK AUTH SAGA')
      response = yield call(api.getFirebaseUserFB, accessToken)
    } else {
      console.tron.log('GMAIL AUTH SAGA')
      response = yield call(api.getFirebaseUserGMAIL, idToken, accessToken)
    }
   
    if (response) {
      // You might need to change the response here - do this with a 'transform',
      // located in ../Transforms/. Otherwise, just pass the data back from the api.
      console.tron.log('RESP: ',response)
      const {email, displayName, photoURL, phoneNumber} = response.user
      yield put(LoginActions.loginSuccess({email, displayName, photoURL: (photoURL ? photoURL : response.additionalUserInfo.profile.picture.data.url), phoneNumber}))
    } else {
      yield put(LoginActions.loginFailure(response))
    }
  } catch(e){
    yield put(LoginActions.loginFailure(e))
  }
}

// export function * getLogin (api, action) {
//   const { data } = action
//   // get current data from Store
//   // const currentData = yield select(LoginSelectors.getData)
//   // make the call to the api
//   const response = yield call(api.getlogin, data)

//   // success?
//   if (response.ok) {
//     // You might need to change the response here - do this with a 'transform',
//     // located in ../Transforms/. Otherwise, just pass the data back from the api.
//     yield put(LoginActions.loginSuccess(response.data))
//   } else {
//     yield put(LoginActions.loginFailure())
//   }
// }

