import React from 'react';
import { Image, View } from 'react-native';

export default class Inventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     items: []
    };
  }

  add(item) {
    this.setState({items: items.concat([item])});
    console.log('Inventory items', this.state.items);
  }

  render() {
    return (
      <View>
        { this.state.items.map((item) => { return (<View><Text>{item.name}</Text></View>) }) }
      </View>
    )
  }
}
