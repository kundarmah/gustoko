import React, { Component } from 'react'
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, ImageBackground, Platform, Animated, Image as RNImage, StatusBar } from 'react-native'
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
import MIcon from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient'
import FakeMarker from '../Components/FakeMarker'

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

const initialSnapPosition = Metrics.hp('85%') - (StatusBar.currentHeight)
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
    this._isMount = true

    this.firebaseAuth = firebase.auth().onAuthStateChanged(authUser => {
      if(authUser){
        console.tron.log(authUser)
        if(this._isMount)
          this.setState({user: authUser})

        firebase
        .firestore()
        .collection('users')
        .doc(authUser.uid)
        .set(this.props.user)
      }
    });

    this.navigatorListener = navigator.geolocation.getCurrentPosition(
      (position) => {
        if(this._isMount)
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
    this._isMount = false

    this.firebaseAuth()
    navigator.geolocation.clearWatch(this.navigatorListener)
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

  renderType = () => {
    return (
      <View style={{flex: 1}}>
        <RegularText styles={{textAlign: 'center', fontSize: Metrics.hp('3%'), padding: Metrics.hp('1%')}}>Choose Type of Agent</RegularText>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={{margin: 4, height: Metrics.hp('10%'), width: Metrics.wp('20%'), borderRadius: 4, justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: Colors.secondaryColor, backgroundColor: Colors.white}}>
            <Icon name="random" size={Metrics.hp('3%')} color={Colors.primaryColor} />
            <RegularText styles={{color: Colors.secondaryColor, fontSize: Metrics.hp('1.64%')}}>Any</RegularText>
          </TouchableOpacity>
          <TouchableOpacity style={{margin: 4, height: Metrics.hp('10%'), width: Metrics.wp('20%'), borderRadius: 4, justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: Colors.secondaryColor, backgroundColor: Colors.white}}>
            <Icon name="male" size={Metrics.hp('3%')} color={Colors.primaryColor} />
            <RegularText styles={{color: Colors.secondaryColor, fontSize: Metrics.hp('1.64%')}}>Walking</RegularText>
          </TouchableOpacity>
          <TouchableOpacity style={{margin: 4, height: Metrics.hp('10%'), width: Metrics.wp('20%'), borderRadius: 4, justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: Colors.secondaryColor, backgroundColor: Colors.white}}>
            <Icon name="motorcycle" size={Metrics.hp('3%')} color={Colors.primaryColor} />
            <RegularText styles={{color: Colors.secondaryColor, fontSize: Metrics.hp('1.64%')}}>Moto</RegularText>
          </TouchableOpacity>
        </View>
      </View>
    )
  } 

  renderLogout = () => {
    return (
      <TouchableOpacity
        style={{position: 'absolute'}}
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
          width: Metrics.hp('5%'),
          height: Metrics.hp('5%'),
          backgroundColor: 'red',
          borderRadius: Metrics.hp('5%')/2,
          overflow: 'hidden'
        }}>
          <Svg
            width={Metrics.hp('5%')}
            height={Metrics.hp('5%')}
          >
            <Image
              href={{uri: this.props.user.photoURL}}
              width={Metrics.hp('5%')}
              height={Metrics.hp('5%')}
              onLoad={() => this.forceUpdate()}
            />
          </Svg>
        </View>
      </Marker>
    )
  }

  renderPrice = () => {
    return (
      <Animatable.View style={{
        flex: 0.5,
        width: '100%',
        alignItems: 'center',
        opacity: this._deltaY.interpolate({
            inputRange: [0, initialSnapPosition],
            outputRange: [1,0]
          })
        }} pointerEvents='none'>
        <View style={{
          position: 'absolute',
          width: Metrics.wp('200%'),
          height: Metrics.wp('200%'),
          borderRadius: Metrics.wp('200%'),
          top: - Metrics.wp('180%'),
          overflow: 'hidden'}}>
          <LinearGradient
            colors={[Colors.primaryColor, Colors.paleColor]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={{height: '100%', width: '100%', position: 'absolute'}}
          />
        </View>
        <View style={{
          backgroundColor: Colors.white,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          flexDirection: 'row',
          bottom: 0,
          borderWidth: 1,
          borderColor: Colors.paleColor,
          borderRadius: Metrics.hp('5%'),
          height: Metrics.hp('5%'),
          width: Metrics.wp('40%')}}>
          <RegularText styles={{color: Colors.primaryColor, fontWeight: 'bold', fontSize: Metrics.hp('2.5%')}}>₱50 </RegularText>
          <RegularText styles={{color: Colors.secondaryColor, fontSize: Metrics.hp('2%')}}>per 30 mins</RegularText>
        </View>
      </Animatable.View>
    )
  }

  renderSlidingPanel = () => {
    return (
      <Interactable.View
        verticalOnly={true}
        snapPoints={[{y: Metrics.hp('2%')},{y: initialSnapPosition}]}
        snapTo={[{y: 0}, {y: 150}]}
        initialPosition={{y: initialSnapPosition}}
        animatedValueY={this._deltaY}
        animatedNativeDriver={true}
        style={{alignItems: 'center'}}
        ref={'book'}
      >
        <Animatable.View
          animation="bounceInUp"
          easing="ease-out"
          duration={2000}
          useNativeDriver={true}
          style={{backgroundColor: 'white',
                  overflow: 'hidden',
                  height: Metrics.hp('75%'),
                  width: Metrics.wp('96%'),
                  borderRadius: 10,
                  alignItems: 'center',
                  elevation: 3}}
        >
         {/* <Animatable.View style={{
            opacity: this._deltaY.interpolate({
              inputRange: [0, initialSnapPosition],
              outputRange: [1,0]
            })
          }}>
              Choose a Category
            </RegularText>
          </Animatable.View>*/}
          <AnimatableTouchableOpacity
            useNativeDriver={true}
            radius={40}
            style={{
              height: Metrics.hp('6%'),
              width: Metrics.wp('80%'),
              borderRadius: Metrics.hp('8%')/2,
              position: 'absolute',
              overflow: 'hidden',
              justifyContent: 'center',
              alignItems: 'center',
              top: Metrics.hp('2.5%'),
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
            onPress={() => this.refs['book'].snapTo({index: 0})}>
            <LinearGradient
              colors={[Colors.primaryColor, Colors.paleColor]}
              start={{x: 0, y: 0}}
              end={{x: 1.5, y: 0}}
              style={{height: '100%', width: '100%', position: 'absolute'}}
            />
            <RegularText styles={{color: Colors.white,fontSize: Metrics.hp('2%')}}>BOOK</RegularText>
          </AnimatableTouchableOpacity>
          {this.renderPrice()}
          {this.renderCategories()}
          {this.renderType()}
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
          <MIcon name="close" color={Colors.primaryColor} size={Metrics.hp('4%')} />
        </TouchableOpacity>
      </Interactable.View>
    )
  }

  renderCategories = () => {
    const { categories } = this.state

    console.tron.log('cat', this.state)

    return (
      <View style={{flex: 1}}>
        <RegularText styles={{
          padding: Metrics.hp('1%'),
          color: Colors.charcoal,
          fontSize: Metrics.hp('3%'),
          textAlign: 'center'
        }}>
          Choose Category
        </RegularText>
        <View style={{
          flex: 1,
          flexWrap: 'wrap',
          paddingTop: Metrics.hp('4%'),
          flexDirection: 'row',
          padding: 4,
          justifyContent: 'center'}}>            
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
      </View>
    )
  }

  handleCategoryChecked = ( index ) => {
    const newCategories = [...this.state.categories];
    
    newCategories[index].isChecked = !newCategories[index].isChecked;

    if(this._isMount)
      this.setState({ categories: newCategories });
  }

  getMapRegion = () => ({
    latitude: this.state.latLong.latitude,
    longitude: this.state.latLong.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  renderFakeMarker = () => {
    const { user } = this.props

    return (
      <FakeMarker
        profileImage={user.photoURL}
      />
    )
  }

  animateFakeMarker = () => {
  }

  render () {
    const { user } = this.props
    return (
      <ScrollView contentContainerStyle={{flex: 1}}>
        <View style={styles.container}>
          <MapView
            zoom={2}
            showsMyLocationButton={true}
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
          {this.renderFakeMarker()}
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
