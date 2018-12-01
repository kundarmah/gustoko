import { StyleSheet } from 'react-native'
import { Colors, Metrics } from '../../Themes'
export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: Metrics.hp('6%'),
    width: Metrics.hp('6%'),
    borderRadius: Metrics.hp('6%'),
    borderWidth: 1,
    borderColor: 'transparent',
    alignSelf: 'center',
    position: 'absolute',
    top: Metrics.hp('50%')
  },
  imageStyle: {
    elevation: 4,
  },
  marker: {
    borderRadius: Metrics.hp('6%'),
    borderWidth: 1,
    overflow: 'hidden',
    height: Metrics.hp('6%'),
    width: Metrics.hp('6%'),
    borderWidth: 4,
    borderColor: Colors.white,
    top: -Metrics.hp('8%'),
    elevation: 4
  },
  pinTip: {
    height: 30,
    width: 6,
    elevation: 3,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.white
  }
})
