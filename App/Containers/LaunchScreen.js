import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ScrollView, Text, Image, View } from 'react-native'
import { LoginButton, AccessToken } from 'react-native-fbsdk'

import { Images } from '../Themes'
import { LoginManager } from 'react-native-fbsdk';

// Styles
import styles from './Styles/LaunchScreenStyles'

export default class LaunchScreen extends Component {

  componentDidMount() {
  }
  
  render () {
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>
          <View style={styles.centered}>
            <Image source={Images.launch} style={styles.logo} />
          </View>

          <View style={styles.section} >
            <Image source={Images.ready} />
            <Text style={styles.sectionText}>
              First Trial Release using MyCode Push!
            </Text>
          </View>
          <LoginButton
            onLoginFinished={
              (error, result) => {
                if (error) {
                  alert("login has error: " + result.error);
                } else if (result.isCancelled) {
                  alert("login is cancelled.");
                } else {
                  AccessToken.getCurrentAccessToken().then(
                    (data) => {
                      alert(data.accessToken.toString())
                    }
                  )
                }
              }
            }
            onLogoutFinished={() => alert("logout.")}
          />
        </ScrollView>
      </View>
    )
  }
}
