import { StyleSheet } from 'react-native'
import { Colors, Metrics } from '../../Themes'

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryColor,
  },
  form: {
    backgroundColor: Colors.snow,
    margin: Metrics.baseMargin,
    borderRadius: 4
  },
  row: {
    paddingVertical: Metrics.doubleBaseMargin,
    paddingHorizontal: Metrics.doubleBaseMargin
  },
  rowLabel: {
    color: Colors.charcoal
  },
  textInput: {
    height: 40,
    color: Colors.coal
  },
  textInputReadonly: {
    height: 40,
    color: Colors.steel
  },
  loginRow: {
    paddingBottom: Metrics.doubleBaseMargin,
    paddingHorizontal: Metrics.doubleBaseMargin,
    flexDirection: 'row'
  },
  loginButtonWrapper: {
    flex: 1
  },
  loginButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.charcoal,
    backgroundColor: Colors.panther,
    padding: 6
  },
  loginText: {
    textAlign: 'center',
    color: Colors.silver
  },
  topLogo: {
    alignSelf: 'center'
  },
  logo: {
    fontFamily: 'Qwigley',
    color: 'white',
    fontSize: Metrics.hp('10%'),
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    paddingTop: Metrics.hp('16%')
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: Metrics.hp('10%')
  },
  facebookButton: {
    height: Metrics.hp('8%'),
    backgroundColor: '#3b5999',
    borderRadius: Metrics.hp('4%'),
    alignItems: 'center',
    justifyContent: 'center', 
    marginHorizontal: Metrics.wp('5%'),
    flexDirection: 'row'
  },
  facebookButtonText: {
    color: 'white',
    paddingLeft: 10,
    opacity: 0.54,
    fontSize: 14
  },
  googleButtonText: {
    color: Colors.primaryColor,
    opacity: 0.54,
    fontSize: 14
  },
  googleLogo: {
    width: Metrics.hp('3%'),
    height: Metrics.hp('3%'),
    marginRight: 8
  },
  backDrop: {
    flex: 1,
    position: 'absolute',
    opacity: 0.8,
    width: Metrics.wp('100%'),
    height: Metrics.hp('100%')
  },
})
