import React from 'react'
import PropTypes from 'prop-types';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  LayoutAnimation,
  ImageBackground,
  Alert,
  Linking
} from 'react-native'
import { connect } from 'react-redux'
import { LoginManager, AccessToken } from 'react-native-fbsdk'
import styles from './Styles/LoginScreenStyles'
import {Images, Metrics, Colors} from '../Themes'
import LoginActions from '../Redux/LoginRedux'
import { RegularText } from '../Components/TextWithFont'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome'
import { GoogleSignin, statusCodes } from 'react-native-google-signin'
import Secrets from 'react-native-config'
import { CheckBox } from 'react-native-elements'

class LoginScreen extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    fetching: PropTypes.bool,
    attemptLogin: PropTypes.func
  }

  isAttempting = false
  keyboardDidShowListener = {}
  keyboardDidHideListener = {}

  constructor (props) {
    super(props)
    this.state = {
      username: 'reactnative@infinite.red',
      password: 'password',
      visibleHeight: Metrics.screenHeight,
      topLogo: { width: Metrics.screenWidth },
      loginButtonDisabled : false,
      isChecked: false
    }
    this.isAttempting = false

    console.tron.log('Working LoginScreen')
  }

  componentDidMount () {
    Metrics.lor(this)
  }

  componentWillReceiveProps (newProps) {
    this.forceUpdate()
    // Did the login attempt complete?
    if (this.isAttempting && !newProps.fetching) {
      this.props.navigation.goBack()
    }
  }

  componentWillMount () {
    // Using keyboardWillShow/Hide looks 1,000 times better, but doesn't work on Android
    // TODO: Revisit this if Android begins to support - https://github.com/facebook/react-native/issues/3468
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
    Metrics.rol()
  }

  keyboardDidShow = (e) => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    let newSize = Metrics.screenHeight - e.endCoordinates.height
    this.setState({
      visibleHeight: newSize,
      topLogo: {width: 100, height: 70}
    })
  }

  keyboardDidHide = (e) => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setState({
      visibleHeight: Metrics.screenHeight,
      topLogo: {width: Metrics.screenWidth}
    })
  }

  handlePressLogin = () => {
    const { username, password } = this.state
    this.isAttempting = true
    // attempt a login - a saga is listening to pick it up from here.
      this.props.attemptLogin(username, password)
  }

  handleChangeUsername = (text) => {
    this.setState({ username: text })
  }

  handleChangePassword = (text) => {
    this.setState({ password: text })
  }

  handleFBLogin = async () => {
    let that = this

    if(this.state.isChecked){
        this.setState({ loginButtonDisabled : true })
        try {
          const result = await LoginManager.logInWithReadPermissions(['public_profile', 'email']);
    
          if (result.isCancelled) {
            console.tron.log('User Cancelled Login'); // Handle this however fits the flow of your app
            this.setState({ loginButtonDisabled : false })
          } else {
            // get the access token
            const data = await AccessToken.getCurrentAccessToken();
            this.setState({ loginButtonDisabled : false })
            // create a new firebase credential with the token
            this.props.attemptLogin(null, data.accessToken)
          }
        } catch (e) {
          console.error(e);
          this.setState({ loginButtonDisabled : false })
        }
    } else {
      Alert.alert(
        'Accept Terms and Conditions',
        'Please PRESS the checkbox BELOW to continue.',
        [
          {text: 'OK', onPress: () => console.log('Ask me later pressed')}
        ]
      )
    }
  }

// Calling this function will open Google for login.
  handleGoogleLogin = async () => {
    if(this.state.isChecked){
        this.setState({ loginButtonDisabled : true })
        try {
          await GoogleSignin.configure({
            webClientId: '1066043128404-q6tokcaefa3me765bbkofor9fdca197c.apps.googleusercontent.com'
          });
          const data = await GoogleSignin.signIn();
          this.setState({ loginButtonDisabled : false })
          this.props.attemptLogin(data.idToken, data.accessToken)
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
            this.setState({ loginButtonDisabled : false })
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (f.e. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
          } else {
            // some other error happened
          }
        }
    } else {
      Alert.alert(
        'Accept Terms and Conditions',
        'Please PRESS the checkbox BELOW to continue.',
        [
          {text: 'OK', onPress: () => console.log('Ask me later pressed')}
        ]
      )
    }
  }



  renderSocialLogin = () => {
    const { loginButtonDisabled } = this.state

    return (
      <View>
        <TouchableOpacity
          onPress={this.handleFBLogin}
          disabled={loginButtonDisabled}
        >
          <View style={styles.facebookButton}>
            <Icon name="facebook-f" size={Metrics.hp('3%')} color="white" />
            <RegularText styles={styles.facebookButtonText}>SIGN IN WITH FACEBOOK</RegularText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.handleGoogleLogin}
          disabled={loginButtonDisabled}
          style={{marginTop: 10}}
        >
          <View style={[styles.facebookButton, {backgroundColor: 'white'}]}>
            <Image style={styles.googleLogo} source={Images.googleLogin} />
            <RegularText styles={styles.googleButtonText}>SIGN IN WITH GOOGLE</RegularText>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderLoginForm = () => {
    const { username, password, loginButtonDisabled } = this.state
    const { fetching } = this.props
    const editable = !fetching
    const textInputStyle = editable ? styles.textInput : styles.textInputReadonly

    return (
      <View style={styles.form}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Username</Text>
          <TextInput
            ref='username'
            style={textInputStyle}
            value={username}
            editable={editable}
            keyboardType='default'
            returnKeyType='next'
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={this.handleChangeUsername}
            underlineColorAndroid='transparent'
            onSubmitEditing={() => this.refs.password.focus()}
            placeholder='Username' />
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Password</Text>
          <TextInput
            ref='password'
            style={textInputStyle}
            value={password}
            editable={editable}
            keyboardType='default'
            returnKeyType='go'
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry
            onChangeText={this.handleChangePassword}
            underlineColorAndroid='transparent'
            onSubmitEditing={this.handlePressLogin}
            placeholder='Password' />
        </View>

        <View style={[styles.loginRow]}>
          <TouchableOpacity style={styles.loginButtonWrapper} onPress={this.handlePressLogin} disabled={this.state.loginButtonDisabled}>
            <View style={styles.loginButton}>
              <Text style={styles.loginText}>Sign In</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButtonWrapper} onPress={() => this.props.navigation.goBack()} disabled={this.state.loginButtonDisabled}>
            <View style={styles.loginButton}>
              <Text style={styles.loginText}>Cancel</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderToC = () => {
    return (
      <View style={{flexDirection: 'row', padding: 12, flex: 1, alignItems: 'baseline', flexWrap: 'wrap', width: Metrics.wp('100%'), alignItems: 'center', justifyContent: 'center', position: 'relative', top: Metrics.hp('20%')}}>
        <CheckBox
          checked={this.state.isChecked}
          checkedColor={Colors.white}
          uncheckedColor={Colors.white}
          containerStyle={{padding: 4, margin: 0, marginLeft: 0, marginRight: 0}}
          onPress={ ()=> this.setState({isChecked: !this.state.isChecked} )}
        />
        <RegularText styles={{color: Colors.white, elevation: 2, fontSize: 12}}>by checking this box, you AGREE to our </RegularText>
        <Text style={{fontSize: 12, color: '#7ec0ee'}}
          onPress={() => {
            const url = 'https://github.com/kundarmah/gustokoph/blob/master/TaC.md'

            Linking.canOpenURL(url).then(supported => {
              if (!supported) {
                console.log('Can\'t handle url: ' + url);
              } else {
                return Linking.openURL(url);
              }
              }).catch(err => console.error('An error occurred', err));
          }}>
           Terms and Conditions 
        </Text>
        <RegularText styles={{color: Colors.white, elevation: 2, fontSize: 12}}> and that you have read our </RegularText>
        <Text style={{fontSize: 12, color: '#7ec0ee'}}
          onPress={() => {
            const url = 'https://github.com/kundarmah/gustokoph/blob/master/README.md'

            Linking.canOpenURL(url).then(supported => {
              if (!supported) {
                console.log('Can\'t handle url: ' + url);
              } else {
                return Linking.openURL(url);
              }
              }).catch(err => console.error('An error occurred', err));
          }}>
           Data Use Policy.
        </Text>
      </View>
    )
  }

  render () {
    return (
      <ScrollView contentContainerStyle={{justifyContent: 'center', flex: 1, width: '100%'}} style={[styles.container, {height: this.state.visibleHeight}]} keyboardShouldPersistTaps='always'>
        <ImageBackground 
          source={Images.backgroundLogin}
          style={{flex: 1}}
        >
          <LinearGradient colors={[Colors.primaryColor, Colors.secondaryColor, 'transparent']} style={styles.backDrop}>
          </LinearGradient>
          <View style={styles.logoContainer}>
            <RegularText 
              fontFamily={'Qwigley'}
              styles={styles.logo}
              color={'white'}
            >
              GustoKo
            </RegularText>
          </View>
          {this.renderSocialLogin()}
          {this.renderToC()}
        </ImageBackground>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fetching: state.login.fetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // attemptLogin: (username, password) => dispatch(LoginActions.loginRequest(username, password))
    attemptLogin: (idToken, accessToken) => dispatch(LoginActions.loginRequest(idToken, accessToken))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
