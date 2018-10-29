import React, { Component } from 'react'
import { ScrollView, View, Text, TouchableOpacity } from 'react-native'
import { RegularText } from '../../Components/TextWithFont'
import LottieView from 'lottie-react-native'
import { Metrics, Colors } from '../../Themes'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from '../Styles/AgentRegisterScreenStyle'

class RegisterScreen extends Component {
  // constructor (props) {
  //   super(props)
  //   this.state = {}
  // }

  render () {
    return (
      <ScrollView style={styles.container}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <LottieView
            source={require('../../Images/Lottie/badge.json')}
            style={{height:Metrics.hp('20%')}}
            autoPlay
            loop
          />
          <RegularText styles={{fontWeight: 'bold', fontSize: Metrics.hp('3%'), padding: 20}}>Welcome, {this.props.user.displayName}!</RegularText>
          <RegularText>Please fill up the following to proceed with you application.</RegularText>
          <TouchableOpacity
            onPress={()=> this.props.navigation.navigate('RegisterScreen')} 
            style={{justifyContent: 'center', alignItems: 'center', margin: 20, height: Metrics.hp('9%'), borderRadius: Metrics.hp('10%'), height: Metrics.hp('7%'), width: Metrics.wp('60%'), backgroundColor: Colors.primaryColor}}>
            <RegularText styles={{color: Colors.white, fontSize: Metrics.hp('2%')}}>
              UPLOAD ID and NBI CLEARANCE
            </RegularText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.login.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen)
