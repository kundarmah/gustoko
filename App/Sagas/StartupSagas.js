import { put, select } from 'redux-saga/effects'
import GithubActions, { GithubSelectors } from '../Redux/GithubRedux'
import LoggedInActions, { isLoggedIn } from '../Redux/LoginRedux'
import AppStateActions from '../Redux/AppStateRedux'

import { is } from 'ramda'
import firebase from 'react-native-firebase'

// exported to make available for tests
export const selectAvatar = GithubSelectors.selectAvatar
export const selectLoggedInStatus = (state) => isLoggedIn(state.login)

// process STARTUP actions
export function * startup (action) {

  // if (!is(String, avatar)) {
  //   yield put(GithubActions.userRequest('GantMan'))
  // }
  yield put(AppStateActions.setRehydrationComplete())
  const isLoggedIn = yield select(selectLoggedInStatus)
  if (isLoggedIn) {
    yield put(LoggedInActions.autoLogin())
  }
  // if (__DEV__ && console.tron) {
    // straight-up string logging
    // console.tron.log('Hello, I\'m an example of how to log via Reactotron.')

    // logging an object for better clarity
    // console.tron.log({
    //   message: 'pass objects for better logging',
    //   someGeneratorFunction: selectAvatar
    // })

    // fully customized!
    // const subObject = { a: 1, b: [1, 2, 3], c: true }
    // subObject.circularDependency = subObject // osnap!
    // console.tron.display({
    //   name: '🔥 IGNITE 🔥',
    //   preview: 'You should totally expand this',
    //   value: {
    //     '💃': 'Welcome to the future!',
    //     subObject,
    //     someInlineFunction: () => true,
    //     someGeneratorFunction: startup,
    //     someNormalFunction: selectAvatar
    //   }
    // })
  // }
  // const avatar = yield select(selectAvatar)
  // only get if we don't have it yet
  // if (!is(String, avatar)) {
  //   yield put(GithubActions.userRequest('GantMan'))
  // }
}
