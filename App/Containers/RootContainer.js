import React, { Component } from 'react'
import { View, StatusBar, SafeAreaView } from 'react-native'
import ReduxNavigation from '../Navigation/ReduxNavigation'
import { connect } from 'react-redux'
import StartupActions from '../Redux/StartupRedux'
import ReduxPersist from '../Config/ReduxPersist'
import firebase from 'react-native-firebase'
// Styles
import styles from './Styles/RootContainerStyles'

const defaultHandler = (ErrorUtils.getGlobalHandler && 
ErrorUtils.getGlobalHandler()) || ErrorUtils._globalHandler

ErrorUtils.setGlobalHandler((error, isFatal) => {
  firebase.crashlytics().log(error.stack)
  if (isFatal) {
    firebase.crashlytics().crash()
  } else {
    firebase.crashlytics().recordError(0, "non-fatal")
  }

  defaultHandler.apply(this, arguments)
})

class RootContainer extends Component {
  componentDidMount () {
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup()
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
        } else {
          this.props.navigate()
          // No user is signed in.
        }
        console.tron.log('USER: ', user)
      });
    }
  }

  render () {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.applicationView}>
          <StatusBar barStyle='light-content' />
          <ReduxNavigation />
        </View>
      </SafeAreaView>
    )
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup())
})

export default connect(null, mapDispatchToProps)(RootContainer)
