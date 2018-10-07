import React, { Component } from 'react'
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import {Images, Metrics, Colors} from '../Themes'
import MapView, { UrlTile, Marker } from 'react-native-maps'
import firebase from 'react-native-firebase'
import LoginActions from '../Redux/LoginRedux'
import Svg, { Image } from 'react-native-svg'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
const styles = StyleSheet.create({
 container: {
   flex: 1,
   borderColor: 'red'
 },
 map: {
   ...StyleSheet.absoluteFillObject,
   flex: 1,
   borderWidth: 1
 },
});

class HomeScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: null,
      latLong: {
        latitude: 37.78825,
        longitude: -122.4324,
        initialRender: true
      }
    }
  }

  componentDidMount () {
    const that = this

    firebase.auth().onAuthStateChanged(authUser => {
      if(authUser){
        console.tron.log(authUser)

        that.setState({user: authUser})
        firebase
        .firestore()
        .collection('users')
        .doc(authUser.uid)
        .set()
      }
    });
  } 

  renderUserAvatar = () => {
    const { user } = this.state

    if (!user) { // evaluates to true if currentVideo is null
      return false; 
    }

    return (
      <View>
        <Text>{user.displayName}</Text>
      </View>
    )
  } 

  renderLogout = () => {
    return (
      <TouchableOpacity
        onPress={() => this.props.logout()}
      >
        <Text>LOGOUT</Text>
      </TouchableOpacity>
    )
  }

  renderMarker = () => {
    return (
      <Marker
          coordinate={this.state.latLong}
      >
          <View style={{
              flexDirection: 'row', width: 100, height: 30,
              backgroundColor: 'orange'
          }}>
              <Svg
                  width={40} height={30}>
                  <Image
                      href={{uri: this.props.user.profile.picture}}
                      width={40}
                      height={30}
                      onLoad={() => this.forceUpdate()}
                  />
              </Svg>
              <View
                  style={{
                      flexDirection: 'column'

                  }}
              >
                  <Text
                      style={{
                          marginLeft: 2,
                          fontSize: 9,
                          color: '#ffffff',
                          fontWeight: 'bold',
                          textDecorationLine: 'underline'
                      }}
                  >{this.props.user.profile.given_name}</Text>
                  <Text
                      style={{
                          marginLeft: 2,
                          fontSize: 9,
                          color: '#ffffff',
                          fontWeight: 'bold',
                          textDecorationLine: 'underline'
                      }}
                  >{this.props.user.profile.given_name}</Text>
              </View>
          </View>
      </Marker>
    )
  }

  render () {
    const { user } = this.props
    return (
      <ScrollView contentContainerStyle={{flex: 1}}>
        <View style={styles.container}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {this.renderMarker()}
          </MapView>
          {this.renderUserAvatar()}
          {this.renderLogout()}
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
    logout: () => dispatch(LoginActions.logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
