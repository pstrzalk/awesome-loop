import React from 'react';
import { Image, View } from 'react-native';

export default class Item extends React.Component {
  color() {
    return this.props.color;
  }
  render() {
    return (
      <View>
        <Text>{this.props.name}</Text>
      </View>
    )
  }
}
