import React, { PropTypes } from 'react'
import { TouchableOpacity, Text, Animated, View} from 'react-native'
import { Colors } from '../Themes'

class RegularText extends React.Component {
  render () {
    return (
      <View style={[this.props.transparent && {backgroundColor: 'transparent'}, this.props.onTop && {zIndex: 9}]}>
        <Text style={[
          {fontFamily: this.props.fontFamily ? this.props.fontFamily : 'Muli', color: Colors.charcoal}, 
          this.props.error && {color: '#ff4444'}, 
          this.props.styles]}>
            {this.props.children}
        </Text>
      </View>
    )
  }
}

class BoldText extends React.Component {
  render () {
    return (
      <View>
        <Text style={[{fontFamily: 'Muli-Bold'}, this.props.styles]}>{this.props.children}</Text>
      </View>
    )
  }
}

export { RegularText, BoldText }
