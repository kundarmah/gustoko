import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { StackNavigator, addNavigationHelpers } from 'react-navigation'
import LoadingScreen from '../Containers/LoadingScreen'
import AuthenticatedNavigator from './AuthenticatedNavigator'
import UnauthenticatedNavigator from './UnauthenticatedNavigator'
import {
  createReduxBoundAddListener,
} from 'react-navigation-redux-helpers'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
export const PrimaryNav = StackNavigator({
  LoadingScreen: { screen: LoadingScreen },
  AuthenticatedStack: { screen: AuthenticatedNavigator },
  UnauthenticatedStack: { screen: UnauthenticatedNavigator }
}, {
  // Default config for all screens
  headerMode: 'none',
  navigationOptions: {
    headerStyle: styles.header
  }
})

const Navigation = ({ dispatch, navigation }) => {
  return (
    <PrimaryNav
      navigation={addNavigationHelpers({ dispatch, state: navigation, addListener: createReduxBoundAddListener("root") })}
    />
  )
}

Navigation.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired
}

function mapStateToProps (state) {
  return {
    navigation: state.navigation
  }
}

// export default PrimaryNav
export default connect(mapStateToProps)(Navigation)
