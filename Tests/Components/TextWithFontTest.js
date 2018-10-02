import 'react-native'
import React from 'react'
import { RegularText } from '../../App/Components/TextWithFont'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

test('RegularFont component renders correctly', () => {
  const tree = renderer.create(<RegularText />)
  expect(tree).toMatchSnapshot()
})

test('RegularFont component renders correctly with styles prop', () => {
  const tree = renderer.create(<RegularText style={{backgroundColor: '#000000'}}/>)
  expect(tree).toMatchSnapshot()
})
