import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, View, StyleSheet, StatusBar } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import LottieView from 'lottie-react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Colors, Metrics } from '../Themes'

// Styles
import styles from './Styles/LoadingScreenStyle'

class LoadingScreen extends Component {
  componentDidMount() {
    // this.animation.play()
  }

  componentWillUnmount() {
    // this.animation.reset();
  }

  render () {
    return (
      <View style={{flex: 1, height: Metrics.hp('100%'), justifyContent: 'center', alignItems: 'center'}}>
        <StatusBar hidden />
        <LinearGradient
          colors={[Colors.primaryColor, Colors.paleColor]}
          start={{x: 0, y: 0}}
          end={{x: 1.5, y: 0}}
          style={{height: Metrics.hp('100%'), width: Metrics.wp('100%'), position: 'absolute', ...StyleSheet.absoluteFillObject}}
        />
        <Text style={{fontSize: Metrics.hp('10%'), textAlign: 'middle', fontFamily: 'Qwigley', color: Colors.white, textAlign: 'center', elevation: 1}}>GustoKo</Text>
       </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen)
