import { StackNavigator } from 'react-navigation'
import HomeScreen from '../Containers/HomeScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
export default StackNavigator({
  AuthenticatedScreen: {
    screen: HomeScreen
  }
}, {
  // Default config for all screens
  headerMode: 'none',
  navigationOptions: {
    headerStyle: styles.header
  }
})
