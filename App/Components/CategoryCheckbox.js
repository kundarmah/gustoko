import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements'
import { Colors, Metrics } from '../Themes'

CategoryCheckbox.propTypes = {
    title: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired
};

export default function CategoryCheckbox(props) {
    return (
        <CheckBox
            center={true}
            title={props.title}
            iconLeft={true}
            textStyle={[styles.checkboxText, { color: props.checked ? '#fff' : Colors.primaryColor }]}
            containerStyle={[styles.checkboxContainer, { backgroundColor: props.checked ? Colors.primaryColor : 'transparent' }]}
            iconType='material'
            checkedIcon='done'
            uncheckedIcon='add'
            checkedColor='#fff'
            onPress={props.onPress}
            uncheckedColor={Colors.primaryColor}
            checked={props.checked}/>
    );
}

const styles = StyleSheet.create({
    checkboxText: {
        fontSize: Metrics.hp('2%'),
        fontWeight: 'normal'
    },
    checkboxContainer: {
        flex: 0,
        borderWidth: 1,
        borderColor: Colors.primaryColor,
        borderRadius: 20,
        marginLeft: 0,
        marginRight: 10,
        height: Metrics.hp('5%'),
        justifyContent: 'center'
    }
});
