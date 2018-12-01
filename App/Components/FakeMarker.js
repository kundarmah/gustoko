import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, Image } from 'react-native'
import styles from './Styles/FakeMarkerStyle'
import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'


export default class FakeMarker extends Component {
  // // Prop type warnings
  // static propTypes = {
  //   someProperty: PropTypes.object,
  //   someSetting: PropTypes.bool.isRequired,
  // }
  //
  // // Defaults for props
  // static defaultProps = {
  //   someSetting: false
  // }

  render () {
    const { profileImage } = this.props
    return (
      <View style={[styles.container]} pointerEvents="none">
        <View style={styles.pinTip}></View>
        <Image
          resizeMode={'center'}
          style={styles.marker}
          source={profileImage}
        />
      </View>
    )
  }
}
