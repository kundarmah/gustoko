import React, { Component } from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import { LoginButton, AccessToken } from 'react-native-fbsdk'

import Auth0 from 'react-native-auth0';
const auth0 = new Auth0({ domain: 'gustokoph.auth0.com', clientId: 'M7SKYyFyPpZF3BMHBMLDap7XpnvZLk7x' });

import { Images } from '../Themes'

// Styles
import styles from './Styles/LaunchScreenStyles'

export default class LaunchScreen extends Component {

  componentDidMount() {
    auth0
    .webAuth
    .authorize({scope: 'facebook openid profile email', audience: 'https://gustokoph.auth0.com/userinfo'})
    .then(credentials =>
      console.log(credentials)
      // Successfully authenticated
      // Store the accessToken
    )
    .catch(error => console.log(error));
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
