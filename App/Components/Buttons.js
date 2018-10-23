import PropTypes from 'prop-types'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Colors, Metrics } from '../Themes'

class ButtonGradient extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    gradientColors: PropTypes.array
  }

  render () {
    return (
      <LinearGradient colors={this.props.gradientColors || [Colors.esmyaGreen, Colors.esmyaBlue]} start={{x: 0, y: 0}} end={{x: 1.5, y: 0}} style={{borderRadius: this.props.radius}}>
      <TouchableOpacity 
        style={[{
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: this.props.radius,
              width: '100%',
              height: '100%'},
              this.props.styles]} 
        onPress={this.props.onPress}
        disabled={this.props.disabled}>
        {this.props.icon}
        {this.props.children}
      </TouchableOpacity>
      </LinearGradient>
    )
  }
}

export { ButtonGradient }