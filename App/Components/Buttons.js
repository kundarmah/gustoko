import PropTypes from 'prop-types'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Colors, Metrics } from '../Themes'
import Icon from 'react-native-vector-icons/FontAwesome'
import { RegularText } from '../Components/TextWithFont'

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

class ButtonInvert extends React.Component {
  render () {
    const {iconName, isSelected} = this.props
    return (
        <TouchableOpacity { ...this.props } style={{margin: 4, height: Metrics.hp('10%'), width: Metrics.wp('20%'), borderRadius: 4, justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: Colors.secondaryColor, backgroundColor: isSelected ? Colors.primaryColor : Colors.white}}>
          <Icon name={iconName ? iconName : "random"} size={Metrics.hp('3%')} color={isSelected ? Colors.white : Colors.primaryColor} />
          <RegularText styles={{color: isSelected ? Colors.white : Colors.secondaryColor, fontSize: Metrics.hp('1.64%')}}>{this.props.children}</RegularText>
        </TouchableOpacity>
    )
  }
}

export { ButtonGradient, ButtonInvert }