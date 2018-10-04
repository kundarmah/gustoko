import React, { Component } from 'react'
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import {Images, Metrics, Colors} from '../Themes'
import MapView, { UrlTile, Marker } from 'react-native-maps'
import firebase from 'react-native-firebase'
import LoginActions from '../Redux/LoginRedux'

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
const styles = StyleSheet.create({
 container: {
   flex: 1,
   borderWidth: 1,
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
        longitude: -122.4324
      }
    }
  }

  componentDidMount() {
    let user = firebase.auth().currentUser;
    
    console.tron.log('USER', user)

    if (user) {
      // User is signed in.
      this.setState({user: user})
    } else {
      // No user is signed in.
    }
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

  render () {
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
            <Marker
              coordinate={this.state.latLong}
              image={Images.mapMarker}
            />
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
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(LoginActions.logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
