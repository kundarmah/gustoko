import { StyleSheet } from 'react-native'
import { Colors } from '../../Themes'
export default StyleSheet.create({
  container: {
    flex: 1
  },
  imageStyle: {
  	left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%'
  },
  marker: {
    height: 52,
    width: 52,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: Colors.white
  }
})
