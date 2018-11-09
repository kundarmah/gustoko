import { StackNavigator } from 'react-navigation'
import HomeScreen from '../Containers/Customer/HomeScreen'
import ChatScreen from '../Containers/Customer/ChatScreen'
import RegisterScreen from '../Containers/Agent/RegisterScreen'
import FinalRegisterScreen from '../Containers/Agent/FinalRegisterScreen'

import React, { Component } from 'react'
import { Image, Text } from 'react-native'
import styles from './Styles/NavigationStyles'
import { Images, Colors, Metrics } from '../Themes'

class LogoTitle extends React.Component {
  render() {
    return (
      <Text style={{fontFamily: 'Qwigley', color: Colors.white, fontSize: Metrics.hp('4%'), elevation: 1}}>GustoKo</Text>
    );
  }
}

// Manifest of possible screens
export default StackNavigator({
  AuthenticatedScreen: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      visible: false,
      header: null
    }),
  },
  ChatScreen: { 
    screen: ChatScreen,
    headerMode: 'screen',
    navigationOptions: ({ navigation }) => ({
      headerMode: 'float',
      headerTitle: <LogoTitle />,
    }),
  },
  RegisterScreen: { 
    screen: RegisterScreen,
    headerMode: 'screen',
    navigationOptions: ({ navigation }) => ({
      headerMode: 'float',
      headerTitle: <LogoTitle />,
    }),
  },
  FinalRegisterScreen: { 
    screen: FinalRegisterScreen,
    headerMode: 'screen',
    navigationOptions: ({ navigation }) => ({
      headerMode: 'screen',
      headerTitle: <LogoTitle />,
    }),
  }
},{
  navigationOptions: {
    headerStyle: styles.header,
    headerTintColor: Colors.white
  }
})
