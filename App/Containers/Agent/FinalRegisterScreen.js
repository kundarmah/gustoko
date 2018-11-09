import React, { Component } from 'react'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import LottieView from 'lottie-react-native'
import { Colors, Metrics } from '../../Themes'
import { connect } from 'react-redux'
import { RegularText } from '../../Components/TextWithFont'
import Icon from 'react-native-vector-icons/FontAwesome'
import firebase from 'react-native-firebase'
import { Input, ButtonGroup } from 'react-native-elements'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from '../Styles/FinalRegisterScreenStyle'

const db = firebase.firestore()


class FinalRegisterScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isButtonValid: false,
      selectedIndex: 0,
      isDone: false,
      phoneNumber: '123'
    }
    this.updateIndex = this.updateIndex.bind(this)
  }

  updateIndex (selectedIndex) {
    this.setState({selectedIndex})
  }

  updateText = (text) => {
    this.setState({ phoneNumber: text })
  }

  submitPhone = () => {
    const that = this
    console.tron.log(this.props.user.uid)

    db.collection("partners").doc(that.props.user.uid).set({
        name: that.props.user.displayName,
        gender: (that.state.selectedIndex == 0 ? 'male' : 'female'),
        pnumber: that.state.phoneNumber,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        active: false
    },{merge: true})
    .then(function(docRef) {
        that.setState({isDone: true})
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    })
  }

  renderFinish = () => {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20}}>
          <LottieView
            source={require('../../Images/Lottie/done.json')}
            style={{height:Metrics.hp('20%')}}
            autoPlay
            loop
          />
        <RegularText styles={{fontWeight: 'bold', textAlign: 'center', fontSize: Metrics.hp('3%'), padding: 20}}>Congratulations!</RegularText>
        <RegularText styles={{textAlign: 'center'}}>Please wait as we verify your application. You will receive a notification through SMS or Email.</RegularText>
        <TouchableOpacity
          disabled={this.state.isButtonValid}
          onPress={()=> this.props.navigation.popToTop()} 
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            margin: 20,
            marginBottom: 10,
            marginTop: 30,
            height: Metrics.hp('9%'),
            borderRadius: Metrics.hp('10%'),
            height: Metrics.hp('7%'),
            width: Metrics.wp('60%'),
            backgroundColor: Colors.primaryColor}}>
            <RegularText styles={{
              color: Colors.white,
              fontSize: Metrics.hp('2%')}}>
              BACK TO HOME
            </RegularText>
        </TouchableOpacity>
      </View>
    )
  }

  renderFirstStep = () => {
    const buttons = ['Male', 'Female']
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <LottieView
            source={require('../../Images/Lottie/downloader.json')}
            style={{height:Metrics.hp('20%')}}
            autoPlay
            loop
          />
          <RegularText styles={{fontWeight: 'bold', textAlign: 'center', fontSize: Metrics.hp('3%'), padding: 20, paddingBottom: 10}}>Congrats! ONE LAST STEP</RegularText>
          <RegularText styles={{marginBottom: 20}}>Please enter your additional details</RegularText>  
          <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={this.state.selectedIndex}
            selectedButtonStyle={{backgroundColor: Colors.primaryColor}}
            buttons={buttons}
            containerBorderRadius={100}
            containerStyle={{height: Metrics.hp('6%'), width: Metrics.wp('79%'), margin: 20}}
          />
           <Input
            containerStyle={{width: Metrics.wp('82%'), padding: 10, marginBottom: 10, marginTop: 10}}
            inputStyle={{fontSize: Metrics.hp('2.1%')}}
            placeholder='Please enter your phone number'
            label="Phone Number"
            onChangeText={this.updateText}
            keyboardType='phone-pad'
            labelStyle={{color: Colors.primaryColor}}
            leftIcon={
              <Icon
                name='phone'
                size={24}
                color={Colors.primaryColor}
              />
            }
          />
          <TouchableOpacity
            onPress={this.submitPhone} 
            style={{justifyContent: 'center', alignItems: 'center', margin: 20, height: Metrics.hp('9%'), borderRadius: Metrics.hp('10%'), height: Metrics.hp('7%'), width: Metrics.wp('80%'), backgroundColor: Colors.primaryColor}}>
            <RegularText styles={{color: Colors.white, fontSize: Metrics.hp('2.1%')}}>
              SUBMIT
            </RegularText>
          </TouchableOpacity>
        </View>
    )
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        {this.state.isDone ? this.renderFinish() : this.renderFirstStep()}
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

export default connect(mapStateToProps, mapDispatchToProps)(FinalRegisterScreen)
