import React from 'react';
import { View, Text } from 'react-native';

export default class Inventory extends React.Component {
  add(item) {
    this.setState({ items: this.state.items.concat([item]) });
    console.log(this.state.items);
    return true;
  }

  clear() {
    this.setState({ items: [] });
  }

  constructor(props) {
    super(props);
    this.state = {
     items: []
    };
  }

  get(item) {
    const pos = state.items.indexOf(item);
    if (pos !== -1) {
      return state.items[pos];
    }
    return false;
  }

  have(item) {
    return state.items.indexOf(item) !== -1;
  }

  items() {
    return this.state.items;
  }

  remove(item) {
    const pos = state.items.indexOf(item);
    if (pos !== -1) {
      this.setState({ items: this.state.items.splice(pos, 1) });
      return true;
    }
    return false;
  }

  render() {
    return null;
    return (
      <View>
        { this.state.items.map((item, index) => {
          return ( <View key={`inventoryitem-${index}`}><Text>{item}</Text></View> )
        }) }
      </View>
    )
  }

  setNativeProps(nativeProps) {
    this.setState();
  }
}
