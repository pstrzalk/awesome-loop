import React from 'react';
import { StyleSheet, Image, View, Dimensions, TouchableWithoutFeedback } from 'react-native';

export default class Maze extends React.Component {
  setNativeProps(nativeProps) {
    this.setState({
      map: nativeProps.map
    });
  }

  constructor(props) {
    super(props);
    this.state = { map: this.props.map};
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    // console.log('componentDidMount', this.state.map);
    // this.setState({
    //   maze: this..maze
    // })
  }

  handleChange(ev) {
    console.log('handeChange', this.state.map);
  }

  render() {
    if (!this.state.map) {
      return null;
    }
    // console.log(this.state.maze);

    const elements = [];
    let row;
    let xPos;
    let yPos;
    for (yPos = 0; yPos < this.state.map.length; yPos++) {
      row = this.state.map[yPos].split('');
      for (xPos = 0; xPos < row.length; xPos++) {
        if (row[xPos] == '1') {
          elements.push({ x: xPos, y: yPos });
        }
      }
    }

    const maze = elements.map((el) => {
      return (
        <View key={`${el.x}:${el.y}`} style={{ flex: 1,
                       position: 'absolute',
                       left: el.x * this.props.cellWidth,
                       bottom: el.y * this.props.cellHeight,
                       width: this.props.cellWidth,
                       height: this.props.cellHeight,
                       backgroundColor: this.props.color
                     }} />
      );
    })
    
    return (
      <View style={this.props.style}>
      {maze}
      </View>
    )
  }
}
