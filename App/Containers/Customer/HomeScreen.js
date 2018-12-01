import React, { Component } from 'react'
import { InteractionManager, Alert, ScrollView, Text, View, StyleSheet, TouchableOpacity, ImageBackground, Platform, Animated, Image as RNImage, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import {Images, Metrics, Colors} from '../../Themes'
import MapView, { UrlTile, Marker } from 'react-native-maps'
import firebase from 'react-native-firebase'
import LoginActions from '../../Redux/LoginRedux'
import Svg, { Image } from 'react-native-svg'
import Interactable from 'react-native-interactable'
import { ButtonGradient, ButtonInvert } from '../../Components/Buttons'
import { RegularText, AnimatedText } from '../../Components/TextWithFont'
import * as Animatable from 'react-native-animatable'
import CategoryCheckbox from '../../Components/CategoryCheckbox'
import MIcon from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient'
import FakeMarker from '../../Components/FakeMarker'
import { GeoFirestore } from 'geofirestore'
import LottieView from 'lottie-react-native';

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

const initialSnapPosition = Metrics.hp('85%')
const AnimatableTouchableOpacity = Animatable.createAnimatableComponent(TouchableOpacity);
const db = firebase.firestore()


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
      agentType: [
        {name: 'Any', icon: 'random', price: '50~80'},
        {name: 'Walking', icon: 'male', price: '50'},
        {name: 'Moto', icon: 'motorcycle', price: '80'},
      ],
      selectedAgentType: 'Any',
      selectedCategories: [],
      selectedPrice: '50~80',
      triggeredCategory: false,
      animatePrice: false,
      hasActiveTask: false,
      activeTaskId: '',
      isFetching: true,
      isPending: false,
      showRegister: false
    }

    this._deltaY = new Animated.Value(initialSnapPosition);
  }

  onRegionChange(region, lastLat, lastLong) {
    this.setState({
      mapRegion: region,
      // If there are no new values set the current ones
      lastLat: lastLat || this.state.latLong.latitude,
      lastLong: lastLong || this.state.latLong.longitude
    });
  }

  async componentDidMount () {

    InteractionManager.runAfterInteractions(() => {
      // this.setState({showRegister: true})
    })

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
        
        //Check all the statuses
        this.checkActiveTask()
        this.checkIfPartner()
      }
    });

    this.navigatorListener = navigator.geolocation.getCurrentPosition(
      (position) => {
        if(this._isMount){
          let region = {
            latitude:       position.coords.latitude,
            longitude:      position.coords.longitude,
            latitudeDelta:  0.00922*1.5,
            longitudeDelta: 0.00421*1.5
          }
          this.onRegionChange(region, region.latitude, region.longitude);
          this.setState({
            latLong: {
              ...this.state.latLong,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }
          })
        }
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    )

    if(this.props.isRehydrated){
      try {
        const fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
          firebase
          .firestore()
          .collection('users')
          .doc(this.props.user.uid)
          .set({fcmToken: fcmToken},{merge: true})
        } else {
            // user doesn't have a device token yet
        }
        // Create a Firebase reference where GeoFirestore will store its information
        const collectionRef = firebase.firestore().collection('locations')

        // Create a GeoFirestore index
        const geoFirestore = new GeoFirestore(collectionRef)
        geoFirestore.set(this.props.user.uid, { coordinates: new firebase.firestore.GeoPoint(this.state.latLong.latitude, this.state.latLong.longitude)}).then((docRef) => {
          // console.log(docRef.id); // ID of newly added document
        }, (error) => {
          console.log('Error: ' + error);
        });
          // console.tron.log('DOC REF: ',docRef.id)
          // await geoFirestore.set(docRef.id, [this.state.latLong.latitude, this.state.latLong.longitude]);
      } catch (err) {
          console.tron.log("Error GeoFire: ", err)
          Alert.alert("Error", "Sorry, there was an error creating your event.");
      }
    }

  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props === nextProps || this.state === nextState) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // } 

  checkIfPartner = () => {
        // firebase
        // .firestore()
        // .collection('partners')
        // .doc(this.props.user.uid)
        // .get().then(function(doc) {
        //     if (doc.exists) {
        //         console.tron.log("Document data:", doc.data().active);
        //     } else {
        //         // doc.data() will be undefined in this case
        //         console.tron.log("No such document!");
        //     }
        // }).catch(function(error) {
        //     console.tron.log("Error getting document:", error);
        // });

  }

  componentWillUnmount () {
    this._isMount = false

    this.firebaseAuth()
    // this.onTokenRefreshListener()
    navigator.geolocation.clearWatch(this.navigatorListener)

    this._deltaY = undefined
  }

  renderUserAvatar = () => {
    const { user } = this.state

    if (!user) { // evaluates to true if currentVideo is null
      return false; 
    }

    return (
      <Animatable.View style={{
        // opacity: this._deltaY.interpolate({
        //   inputRange: [0, initialSnapPosition],
        //   outputRange: [1,0]
        // })
      }}>
        <Text>{user.displayName}</Text>
        <Image
          style={{height: Metrics.hp('10%'), width: Metrics.hp('10%')}} 
          source={{uri: user.photoURL}} />
      </Animatable.View>
    )
  }

  renderAgentType = () => {
    const { selectedAgentType } = this.state
    return (
      <View style={{flex: 1, alignItems: 'center', paddingTop: Metrics.hp('5%')}}>
        {
          this.state.triggeredCategory && <Animatable.View
            useNativeDriver={true}
            animation="fadeInUp"
            easing="ease-out"
            duration={200}
          >
            <RegularText styles={{textAlign: 'center', fontSize: 14, padding: Metrics.hp('1%')}}>Choose Type of Agent</RegularText>
            <View style={{flexDirection: 'row'}}>
              {
                this.state.agentType.map((agent, i) => <ButtonInvert onPress={() => this.setState({selectedAgentType: agent.name, selectedPrice: agent.price, animatePrice: true})} key={i} isSelected={selectedAgentType == agent.name ? true : false} iconName={agent.icon}>{agent.name}</ButtonInvert>)
              }
            </View>
          </Animatable.View>
        }
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
      <Animatable.View
        animatedNativeDriver={true}
        style={{
        height: Metrics.hp('14%'),
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
        <View
          style={{
            backgroundColor: Colors.white,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            flexDirection: 'row',
            bottom: Metrics.hp('1%'),
            borderWidth: 1,
            borderColor: Colors.paleColor,
            borderRadius: Metrics.hp('5%'),
            height: Metrics.hp('5%'),
            width: Metrics.wp('40%')}}>
          <AnimatedText
            animation={this.state.animatePrice ? 'bounceIn' : undefined} 
            onAnimationend={()=> this.setState({animatePrice: false})}
            duration={200}
            styles={{color: Colors.primaryColor, fontWeight: 'bold', fontSize: 13}}>₱{this.state.selectedPrice+' '} 
          </AnimatedText>
          <RegularText styles={{color: Colors.secondaryColor, fontSize: 14}}>per 30 mins</RegularText>
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
          style={{
                  flexDirection: 'column',
                  backgroundColor: 'white',
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
            <RegularText styles={{color: Colors.white, fontSize: 14}}>BOOK</RegularText>
          </AnimatableTouchableOpacity>
          {this.renderPrice()}
          {this.renderCategories()}
          {this.renderAgentType()}
          <TouchableOpacity
            style={{
              height: Metrics.hp('10%'),
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={this.createTask}
          >
            <LinearGradient
              colors={[Colors.primaryColor, Colors.paleColor]}
              start={{x: 0, y: 0}}
              end={{x: 1.5, y: 0}}
              style={{height: '100%', width: '100%', position: 'absolute'}}
            />
            <RegularText
              styles={{color: Colors.white, fontSize: 20}}
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

  renderMatchedPanel = () => {
    return (
      <View>
          <View style={{flex: 1}}>
            <TouchableOpacity
              onPress={()=>this.props.navigation.navigate('ChatScreen',{activeTaskId: this.state.activeTaskId})}
              style={{
                width: Metrics.hp('10%'),
                height: Metrics.hp('10%'),
                borderRadius: Metrics.hp('10%'),
                backgroundColor: Colors.primaryColor,
                justifyContent: 'center',
                alignItems: 'center'}}>
              <Icon name="envelope-o" color={Colors.white} size={Metrics.hp('3%')}/>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{
              height: Metrics.hp('10%'),
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={this.cancelTask}
          >
            <LinearGradient
              colors={[Colors.alertColor, Colors.alertColor]}
              start={{x: 0, y: 0}}
              end={{x: 1.5, y: 0}}
              style={{height: '100%', width: '100%', position: 'absolute'}}
            />
            <RegularText
              styles={{color: Colors.white, fontSize: Metrics.hp('3%')}}
            >
              Cancel Task
            </RegularText>
          </TouchableOpacity>
      </View>
    )
  }

  renderPendingPanel = () => {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', padding: 20}}>
        <RegularText styles={{fontWeight: 'bold', fontSize: 16}}>Searching for Agents...</RegularText>
        <RegularText>Please wait as we match you. (This has no charge yet)</RegularText>
      </View>
    )
  }

  renderActiveTaskPanel = () => {
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
          style={{
                  flexDirection: 'column',
                  backgroundColor: 'white',
                  overflow: 'hidden',
                  height: (this.state.isPending ?  Metrics.hp('15%') : Metrics.hp('75%')),
                  width: Metrics.wp('96%'),
                  borderRadius: 10,
                  alignItems: 'center',
                  elevation: 3}}
        >
          {this.state.isPending ? this.renderPendingPanel() : this.renderMatchedPanel()}
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
      this.setState({ categories: newCategories, triggeredCategory: true });

    console.log('newCategories: ', newCategories)
  }

  createTask = () => {
    this.refs['book'].snapTo({index: 1})

    // this.setState({showRegister: true})
    let that = this
    const { displayName, photoURL } = this.props.user
    const { categories, user } = this.state

    db.collection("tasks").add({
        cname: displayName,
        cphoto: photoURL,
        cuid: user.uid,
        active: true,
        isPending: true,
        selectedCategories: categories
    })
    .then(function(docRef) {
        console.tron.log("Document written with ID: ", docRef.id);
        // that.props.navigation.navigate('ChatScreen')
        that.setState({hasActiveTask: true, isPending: true})
        that.listenToTask(docRef.id)

    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }

  listenToTask = (documentId) => {
    let that = this
    //Listen to changes
    db.collection("tasks").doc(documentId)
    .onSnapshot(function(doc) {
        console.tron.log("Current data: ", doc.data());
        if( doc.data().isPending === false ){
          that.props.navigation.navigate('ChatScreen')
          that.setState({isPending: false})
        } else {

        }
    });
  }

  cancelTask = () => {
    db.collection("tasks").doc(this.state.activeTaskId).set({
        active: false
    },{merge: true})
    .then(function(docRef) {
        that.setState({hasActiveTask: false})
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }

  getMapRegion = () => ({
    latitude: this.state.latLong.latitude,
    longitude: this.state.latLong.longitude,
    latitudeDelta: 0.922,
    longitudeDelta: 0.421,
  })

  checkActiveTask = () => {
    let that = this
    console.tron.log('UID: ', this.props.user.uid)
    const docRef = db.collection("tasks")
                  .where('cuid', '==', this.props.user.uid)
                  .where('active', '==', true)

    docRef.get().then(function(querySnapshot) {
      if (querySnapshot.empty) {
        console.tron.log('no documents found')
      } else {
        querySnapshot.forEach(doc => {
          console.tron.log(doc.id, '=>', doc.data());
          that.setState({activeTaskId: doc.id})
          that.listenToTask(doc.id)
        });
        that.setState({hasActiveTask : true})
      }
      that.setState({isFetching: false})
    }).catch(function(error) {
        console.tron.log("Error getting document:", error)
    });
  }

  renderFakeMarker = () => {
    const { user } = this.props

    return (
      <FakeMarker
        profileImage={Images.gustokoLogo}
      />
    )
  }

  animateFakeMarker = () => {
  }

  renderRegister = () => {
    return (
        <View style={{height: '100%', width: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'center'}}>
          <View
            animation="flipInX"
            duration={3000}
            useNativeDriver={true} 
            style={{height: '100%', width: '100%', position: 'absolute', backgroundColor: Colors.charcoal, opacity: 0.5}}>
          </View>
          <View style={{position: 'absolute', backgroundColor: Colors.white, width: '90%', height: '60%', borderRadius: 5, elevation: 3, justifyContent: 'center', alignItems: 'center'}}>
            <LottieView
              source={require('../../Images/Lottie/empty_box.json')}
              style={{height:Metrics.hp('20%')}}
              autoPlay
              loop
            />
            <RegularText styles={{fontWeight: 'bold', fontSize: 14}}>Oops, No Agents Near You.</RegularText>
            <RegularText>Maybe you can apply as one?</RegularText>
            <TouchableOpacity
              onPress={()=> this.props.navigation.navigate('RegisterScreen')} 
              style={{justifyContent: 'center', alignItems: 'center', margin: 10, height: Metrics.hp('9%'), borderRadius: Metrics.hp('10%'), height: Metrics.hp('7%'), width: Metrics.wp('60%'), backgroundColor: Colors.primaryColor}}>
              <RegularText styles={{color: Colors.white, fontSize: 14}}>
                APPLY NOW
              </RegularText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=> this.setState({showRegister: false})} 
              style={{justifyContent: 'center', alignItems: 'center', margin: 10, marginTop: 0, height: Metrics.hp('9%'), borderRadius: Metrics.hp('10%'), height: Metrics.hp('7%'), width: Metrics.wp('60%'), backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.primaryColor}}>
              <RegularText styles={{color: Colors.primaryColor, fontSize: 14}}>
                CANCEL
              </RegularText>
            </TouchableOpacity>
          </View>
        </View>
      )
  }

  render () {
    const { user } = this.props
    return (
      <ScrollView contentContainerStyle={{flex: 1}}>
        <StatusBar hidden />
        <View style={styles.container}>
          <MapView
            zoom={2}
            showsMyLocationButton={true}
            followUserLocation
            loadingEnabled
            showsCompass
            style={styles.map}
            initialRegion={{
             latitude:-6.270565,
             longitude:106.759550,
             latitudeDelta: 1,
             longitudeDelta: 1
            }}
            region={this.getMapRegion()}
          >
            {/*this.renderMarker()*/}
          </MapView>
          {this.renderFakeMarker()}
          {this.renderUserAvatar()}
          {this.renderLogout()}
          <Animatable.View
            animatedNativeDriver={true}
            pointerEvents='none'
            style={{
              backgroundColor: Colors.charcoal,
              height: '100%',
              width: '100%',
              position: 'absolute',
              opacity: this._deltaY.interpolate({
                inputRange: [0, initialSnapPosition],
                outputRange: [0.7,0]
              })
          }}>
          </Animatable.View>
          {!this.state.isFetching && (this.state.hasActiveTask ? this.renderActiveTaskPanel() : this.renderSlidingPanel())}
          {this.state.showRegister && this.renderRegister()}  
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.login.user,
    isRehydrated: state.appState.rehydrationComplete
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(LoginActions.logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
