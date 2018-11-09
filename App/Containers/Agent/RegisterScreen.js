import React, { Component } from 'react'
import { ActivityIndicator, ScrollView, View, Text, TouchableOpacity, Image, Platform, NativeModules, LayoutAnimation } from 'react-native'
import { RegularText } from '../../Components/TextWithFont'
import LottieView from 'lottie-react-native'
import { Metrics, Colors } from '../../Themes'
import { connect } from 'react-redux'
import ImagePicker from 'react-native-image-picker'
import RNFetchBlob from 'react-native-fetch-blob'
import firebase from 'react-native-firebase'

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from '../Styles/AgentRegisterScreenStyle'

// More info on all the options is below in the API Reference... just some common use cases shown here
const options = {
  title: 'Select Requirements',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
}

const { UIManager } = NativeModules
const CustomAnimation = {
  duration: 400,
  create: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.scaleXY,
    springDamping: 0.7
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 0.7
  }
}

class RegisterScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      idImagePath: null,
      idImageHeight: null,
      idImageWidth: null,
      nbiImagePath: null,
      nbiImageHeight: null,
      nbiImageWidth: null,
      isUploadValid: false,
      isUploadNbi: false,
      isButtonValid: false,
      isButtonNbi: false
    }

    UIManager.setLayoutAnimationEnabledExperimental(true)
  }

  saveImage = (uri, imageName, valid) => {
        const Blob = RNFetchBlob.polyfill.Blob
        const fs = RNFetchBlob.fs
        const mime = "application/octet-stream"
        const imgUri = uri
        let uploadBlob = ""
        const storageRef = firebase
          .storage()
          .ref("req_image")
          .child(`${imageName}.jpeg`)

        console.tron.log('======START IMAGE UPLOAD======')
        console.tron.log(uri)
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
        window.Blob = new Blob()

        fs.readFile(imgUri, "base64")
          .then(data => {
            console.tron.log('MIME: ', mime)
            return Blob.build(data, { type: `${mime};BASE64` })
          })
          .then(blob => {
            uploadBlob = blob
            return storageRef.put(blob._ref, { contentType: mime })
          })
          .then(() => {
            uploadBlob.close()
            return storageRef.getDownloadURL()
          })
          .then(url => {
            console.tron.log('VALIDID: ', url)
            LayoutAnimation.configureNext( CustomAnimation )
            if(valid == 'nbi')
              this.setState({isUploadNbi: true})
            else
               this.setState({isUploadValid: true})
          })
          .catch(error => {
            console.tron.log("Sorry, there is an error", error)
          })

        console.tron.log('======END IMAGE UPLOAD======')
  }

  uploadValidIdSuccess = (url) => {
    console.tron.log(url)
  }

  uploadValidIdError = (url) => {
    console.tron.log(url)
  }

  uploadValidID = () => {
    const cam_options = {
      mediaType: 'photo',
      maxWidth: 1000,
      maxHeight: 1000,
      quality: 1,
      noData: true,
    };
    ImagePicker.launchCamera(cam_options, (response) => {
      if (response.didCancel) {
      }
      else if (response.error) {
      }
      else {
        this.setState({
          idImagePath: response.uri,
          idImageHeight: response.height,
          idImageWidth: response.width,
          isButtonValid: true
        })

        this.saveImage(response.uri, `validid-${this.props.user.uid}`, 'validid')
      }
    })
  }

  uploadNBI = () => {
    const cam_options = {
      mediaType: 'photo',
      maxWidth: 1000,
      maxHeight: 1000,
      quality: 1,
      noData: true,
    };
    ImagePicker.launchCamera(cam_options, (response) => {
      if (response.didCancel) {
      }
      else if (response.error) {
      }
      else {
        this.setState({
          nbiImagePath: response.uri,
          nbiImageHeight: response.height,
          nbiImageWidth: response.width,
          isButtonNbi: true
        })
        this.saveImage(response.uri, `nbi-${this.props.user.uid}`, 'nbi')

      }
    })
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          {!(this.state.isUploadValid && this.state.isUploadNbi) ? <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                      <LottieView
                        source={require('../../Images/Lottie/badge.json')}
                        style={{height:Metrics.hp('20%')}}
                        autoPlay
                        loop
                      />
                      <RegularText styles={{fontWeight: 'bold', textAlign: 'center', fontSize: Metrics.hp('3%'), padding: 20}}>Welcome, {this.props.user.displayName}!</RegularText>
                      <RegularText styles={{textAlign: 'center'}}>Please fill up the following to proceed with your application.</RegularText>
                      <View style={{flex: 1, height: Metrics.hp('30%'), flexDirection: 'row', padding: 20}}>
                        <Image
                          source={{ uri:this.state.idImagePath }}
                          resizeMode='contain'
                          style={{
                            height: Metrics.hp('30%'),
                            width: Metrics.wp('30%'),
                            alignSelf: 'center',
                            margin: 10,
                          }}
                        />
                        <Image
                          source={{ uri:this.state.nbiImagePath }}
                          resizeMode='contain'
                          style={{
                            height: Metrics.hp('30%'),
                            width: Metrics.wp('30%'),
                            alignSelf: 'center',
                            margin: 10,
                          }}
                        />
                      </View>
                    </View> : <View style={{flex: 1, padding: 20,  justifyContent: 'center', alignItems: 'center'}}>
                      <LottieView
                        source={require('../../Images/Lottie/process_complete.json')}
                        style={{height:Metrics.hp('20%')}}
                        autoPlay
                        loop
                      />
                      <RegularText styles={{fontWeight: 'bold', textAlign: 'center', fontSize: Metrics.hp('3%'), padding: 20}}>Thanks, {this.props.user.displayName}!</RegularText>
                      <RegularText>That was fast, click NEXT to proceed.</RegularText>
                    </View>}
          {!this.state.isUploadValid && <TouchableOpacity disabled={this.state.isButtonValid}
                      onPress={this.uploadValidID} 
                      style={{justifyContent: 'center', alignItems: 'center', margin: 20, marginBottom: 10, height: Metrics.hp('9%'), borderRadius: Metrics.hp('10%'), height: Metrics.hp('7%'), width: Metrics.wp('60%'), backgroundColor: Colors.primaryColor}}>
                      {!this.state.isButtonValid ? <RegularText styles={{color: Colors.white, fontSize: Metrics.hp('2%')}}>
                      UPLOAD VALID ID
                      </RegularText> : <ActivityIndicator color={Colors.white}/>}
                    </TouchableOpacity>}
          {!this.state.isUploadNbi && <TouchableOpacity disabled={this.state.isButtonNbi}
                      onPress={this.uploadNBI} 
                      style={{justifyContent: 'center', alignItems: 'center', margin: 5, height: Metrics.hp('9%'), borderRadius: Metrics.hp('10%'), height: Metrics.hp('7%'), width: Metrics.wp('60%'), backgroundColor: Colors.primaryColor}}>
                      {!this.state.isButtonNbi ? <RegularText styles={{color: Colors.white, fontSize: Metrics.hp('2%')}}>
                        UPLOAD NBI CLEARANCE
                      </RegularText> : <ActivityIndicator color={Colors.white}/>}
                    </TouchableOpacity>}
          {(this.state.isUploadNbi && this.state.isUploadValid) && <TouchableOpacity
                      onPress={()=>this.props.navigation.navigate('FinalRegisterScreen')} 
                      style={{justifyContent: 'center', alignItems: 'center', margin: 5, marginBottom: 20,height: Metrics.hp('9%'), borderRadius: Metrics.hp('10%'), height: Metrics.hp('7%'), width: Metrics.wp('60%'), backgroundColor: Colors.primaryColor}}>
                      <RegularText styles={{color: Colors.white, fontSize: Metrics.hp('2%')}}>
                        NEXT
                      </RegularText>
                    </TouchableOpacity>}
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
