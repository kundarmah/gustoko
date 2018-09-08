import './App/Config/ReactotronConfig'
import { AppRegistry } from 'react-native'
import App from './App/Containers/App'
import codePush from "react-native-code-push";


let codePushOptions = { 
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME, 
  installMode: codePush.InstallMode.ON_NEXT_RESUME 
}

GustoKo = codePush(codePushOptions)(App);
AppRegistry.registerComponent('GustoKo', () => GustoKo)
