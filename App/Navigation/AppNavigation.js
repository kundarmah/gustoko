import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { StackNavigator, addNavigationHelpers } from 'react-navigation'
import HomeScreen from '../Containers/HomeScreen'
import LoginScreen from '../Containers/LoginScreen'

import AuthenticatedNavigator from './AuthenticatedNavigator'
import UnauthenticatedNavigator from './UnauthenticatedNavigator'


import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  UnauthenticatedStack: { screen: UnauthenticatedNavigator },
  AuthenticatedStack: { screen: AuthenticatedNavigator },
  HomeScreen: { screen: HomeScreen },
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
      navigation={addNavigationHelpers({ dispatch, state: navigation })}
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

export default PrimaryNav
