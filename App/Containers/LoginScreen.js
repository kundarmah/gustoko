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
  ImageBackground
} from 'react-native'
import { connect } from 'react-redux'
import { LoginManager, AccessToken } from 'react-native-fbsdk'
import styles from './Styles/LoginScreenStyles'
import {Images, Metrics, Colors} from '../Themes'
import LoginActions from '../Redux/LoginRedux'
import { RegularText } from '../Components/TextWithFont'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome'


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
      topLogo: { width: Metrics.screenWidth }
    }
    this.isAttempting = false

    console.tron.log('Working LoginScreen')
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

  handleFBLogin = () => {
    LoginManager.logInWithReadPermissions(['public_profile']).then(
      function(result) {
        if (result.isCancelled) {
          console.tron.log('Login cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then(
            (data) => {
              console.log(data.accessToken.toString())
            }
          )
        }
      },
      function(error) {
        console.tron.log('Login fail with error: ' + error);
      }
    )
  }

  renderSocialLogin = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={this.handleFBLogin}
        >
          <View style={styles.facebookButton}>
            <Icon name="facebook-f" size={Metrics.hp('3%')} color="white" />
            <RegularText styles={styles.facebookButtonText}>Log In with Facebook</RegularText>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderLoginForm = () => {
    const { username, password } = this.state
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
          <TouchableOpacity style={styles.loginButtonWrapper} onPress={this.handlePressLogin}>
            <View style={styles.loginButton}>
              <Text style={styles.loginText}>Sign In</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButtonWrapper} onPress={() => this.props.navigation.goBack()}>
            <View style={styles.loginButton}>
              <Text style={styles.loginText}>Cancel</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render () {
    return (
      <ScrollView contentContainerStyle={{justifyContent: 'center', flex: 1}} style={[styles.container, {height: this.state.visibleHeight}]} keyboardShouldPersistTaps='always'>
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
    attemptLogin: (username, password) => dispatch(LoginActions.loginRequest(username, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
