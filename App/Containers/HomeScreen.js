import React, { Component } from 'react'
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, ImageBackground, Platform, Animated, Image as RNImage } from 'react-native'
import { connect } from 'react-redux'
import {Images, Metrics, Colors} from '../Themes'
import MapView, { UrlTile, Marker } from 'react-native-maps'
import firebase from 'react-native-firebase'
import LoginActions from '../Redux/LoginRedux'
import Svg, { Image } from 'react-native-svg'
import Interactable from 'react-native-interactable'
import { ButtonGradient } from '../Components/Buttons'
import { RegularText } from '../Components/TextWithFont'
import * as Animatable from 'react-native-animatable'
import CategoryCheckbox from '../Components/CategoryCheckbox'
import Icon from 'react-native-vector-icons/MaterialIcons'
import LinearGradient from 'react-native-linear-gradient'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
const styles = StyleSheet.create({
 container: {
   flex: 1,
   borderColor: 'red',
   alignItems: 'center'
 },
 map: {
   ...StyleSheet.absoluteFillObject,
   flex: 1,
   borderWidth: 1
 },
});

const snapFactor = (Metrics.screenHeight - 488 + (Platform.OS === 'android' ? 150 : 0)) / 21
const initialSnapPosition = Metrics.hp('80%')
const AnimatableTouchableOpacity = Animatable.createAnimatableComponent(TouchableOpacity);


class HomeScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: null,
      latLong: {
        latitude: 37.78825,
        longitude: -122.4324,
      },
      initialRender: true,
      categories: [
        {name: 'cleaning', isChecked: false},
        {name: 'laundry', isChecked: false},
        {name: 'delivery', isChecked: false},
        {name: 'grocery', isChecked: false},
        {name: 'messenger', isChecked: false}
      ],
      selectedCategories: [] 
    }

    this._deltaY = new Animated.Value(initialSnapPosition);
  }

  componentDidMount () {
    this.firebaseAuth = firebase.auth().onAuthStateChanged(authUser => {
      if(authUser){
        console.tron.log(authUser)

        this.setState({user: authUser})

        firebase
        .firestore()
        .collection('users')
        .doc(authUser.uid)
        .set()
      }
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latLong: {
            ...this.state.latLong,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
        })
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    )
  } 

  componentWillUnmount () {
    this.firebaseAuth()
    this._deltaY = undefined
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
          flexDirection: 'row',
          width: 50,
          height: 50,
          backgroundColor: 'red',
          borderRadius: 25,
          overflow: 'hidden'
        }}>
          <Svg
            width={50}
            height={50}
          >
            <Image
              href={{uri: this.props.user.profile.picture}}
              width={50}
              height={50}
              onLoad={() => this.forceUpdate()}
            />
          </Svg>
        </View>
      </Marker>
    )
  }

  renderSlidingPanel = () => {
    return (
      <Interactable.View
        verticalOnly={true}
        snapPoints={[{y: Metrics.screenHeight*0.15}, {y: initialSnapPosition}]}
        snapTo={[{y: 0}, {y: 150}]}
        boundaries={{top: Metrics.hp('10%')}}
        initialPosition={{y: initialSnapPosition}}
        animatedValueY={this._deltaY}
        animatedNativeDriver={true}
        style={{alignItems: 'center'}}
        ref={'book'}
      >
{/*        <View style={{zIndex: 2, position: 'absolute', top: -(Metrics.hp('5%')),height: Metrics.hp('10%'), width: Metrics.hp('10%'), borderWidth: 1}}>
          <RNImage 
            source={Images.gustokoLogo}
            resizeMode="contain"
            width={40}
            height={40}
          />
        </View>*/}
        <Animatable.View
          animation="bounceInUp"
          easing="ease-out"
          duration={2000}
          useNativeDriver={true}
          style={{backgroundColor: 'white', overflow: 'hidden', height: Metrics.hp('60%'), width: Metrics.wp('96%'), paddingTop: Metrics.hp('2.5%'), borderRadius: 10, alignItems: 'center', elevation: 3}}
        >
          <AnimatableTouchableOpacity
          useNativeDriver={true}
            radius={40}
            style={{
              height: 40,
              width: Metrics.wp('80%'),
              borderRadius: 20,
              overflow: 'hidden',
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 2,
              transform: [{
                scaleX: this._deltaY.interpolate({
                  inputRange: [0, initialSnapPosition],
                  outputRange: [0,1]
                })
              }],
              transform: [{
                translateY: this._deltaY.interpolate({
                  inputRange: [0, initialSnapPosition],
                  outputRange: [-200, 0]
                })
              }]
            }}
            onPress={() => this.refs['book'].snapTo({index: 0})}
          >
            <LinearGradient
              colors={[Colors.primaryColor, Colors.paleColor]}
              start={{x: 0, y: 0}}
              end={{x: 1.5, y: 0}}
              style={{height: '100%', width: '100%', position: 'absolute'}}
            />
            <RegularText styles={{color: Colors.white}}>BOOK</RegularText>
          </AnimatableTouchableOpacity>
          {this.renderCategories()}
          <TouchableOpacity
            style={{
              height: Metrics.hp('10%'),
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <LinearGradient
              colors={[Colors.primaryColor, Colors.paleColor]}
              start={{x: 0, y: 0}}
              end={{x: 1.5, y: 0}}
              style={{height: '100%', width: '100%', position: 'absolute'}}
            />
            <RegularText
              styles={{color: Colors.white, fontSize: Metrics.hp('3%')}}
            >
              Confirm
            </RegularText>
          </TouchableOpacity>
        </Animatable.View>
        <TouchableOpacity 
          onPress={() => this.refs['book'].snapTo({index: 1})}
          style={{
            elevation: 4,
            marginTop: Metrics.hp('2%'),
            backgroundColor: Colors.white,
            height: Metrics.hp('10%'),
            width: Metrics.hp('10%'),
            borderRadius: Metrics.hp('10%'),
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Icon name="close" color={Colors.primaryColor} size={30} />
        </TouchableOpacity>
      </Interactable.View>
    )
  }

  renderCategories = () => {
    const { categories } = this.state

    console.tron.log('cat', this.state)

    return (
      <View style={{flex: 1, flexWrap: 'wrap', paddingTop: 20, flexDirection: 'row', padding: 4, justifyContent: 'center'}}>
        {
          categories.map(( category, i ) => {
            return (
              <CategoryCheckbox
                key={i}
                title={category.name}
                checked={category.isChecked}
                onPress={() => this.handleCategoryChecked(i)}
              />
            )
          })
        }
      </View>
    )
  }

  handleCategoryChecked = ( index ) => {
    const newCategories = [...this.state.categories];
    
    newCategories[index].isChecked = !newCategories[index].isChecked;

    this.setState({ categories: newCategories });
  }

  getMapRegion = () => ({
    latitude: this.state.latLong.latitude,
    longitude: this.state.latLong.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  render () {
    const { user } = this.props
    return (
      <ScrollView contentContainerStyle={{flex: 1}}>
        <View style={styles.container}>
          <MapView
            zoom={2}
            showUserLocation
            followUserLocation
            loadingEnabled
            showsCompass
            style={styles.map}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            region={this.getMapRegion()}
          >
            {this.renderMarker()}
          </MapView>
          {this.renderUserAvatar()}
          {this.renderLogout()}
          {this.renderSlidingPanel()}
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
