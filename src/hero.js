import React from 'react';
import { Image, View } from 'react-native';

export default class Hero extends React.Component {
  render() {
    return (
      <View width={this.props.width} height={this.props.height} style={this.props.style}>
        <Image
          style={{
            flex: 1,
            width: undefined,
            height: undefined,
            backgroundColor:'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          source={ require('./images/knight.png') } />
      </View>
    )
  }
}
