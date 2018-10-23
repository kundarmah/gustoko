import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, View } from 'react-native'
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
      <View styles={{borderWidth: 1, borderColor: 'red', justifyContent: 'center', alignItems: 'center'}}>
        <Text styles={{textAlign: 'middle'}}>Please wait...</Text>
        <LinearGradient style={{flex: 1}} colors={[Colors.primaryColor, Colors.paleColor]} start={{x: 0, y: 0}} end={{x: 1.5, y: 0}} />
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
