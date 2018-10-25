import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, Image } from 'react-native'
import styles from './Styles/FakeMarkerStyle'

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
      <View style={[styles.container, styles.imageStyle]} pointerEvents="none">
        <Image
          style={styles.marker}
          source={{uri: profileImage}}
        />
      </View>
    )
  }
}
