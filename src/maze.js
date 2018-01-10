import React from 'react';
import { StyleSheet, Image, View, Dimensions, TouchableWithoutFeedback } from 'react-native';

export default class Maze extends React.Component {
  WALL = '1';
  DOORS = ['A', 'B', 'C', 'D'];
  DOOR_COLORS = {
    'A': '#FFFF00',
    'B': '#FF0000',
    'C': '#00FF00',
    'D': '#0000FF'
  }
  KEYS = ['a', 'b', 'c', 'd'];
  KEY_IMAGES = {
    a: require('./images/key-a.png'),
    b: require('./images/key-b.png'),
    c: require('./images/key-c.png'),
    d: require('./images/key-d.png'),
  }
  PASS = '0';
  START = '0';
  FINISH = '9';

  canOpenDoor(x, y, key) {
    if (this.isDoor(x, y) && this.state.map[y][x].toUpperCase() == key.toUpperCase()) {
      return true;
    }
    return false;
  }

  canPickUp(x, y) {
    if (this.isPickable(x, y)) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    this.setState({
      walls: [],
      keys: [],
      doors: []
    })
  }

  constructor(props) {
    super(props);
    this.state = { map: this.props.map};
  }

  componentDidMount() {
    this.parseMap();
  }

  isDoor(x, y) {
    return this.DOORS.indexOf(this.state.map[y][x]) !== -1;
  }

  isKey(x, y) {
    return this.KEYS.indexOf(this.state.map[y][x]) !== -1;
  }

  isPickable(x, y) {
    return this.isKey(x, y);
  }

  isWall(x, y) {
    return this.WALL == this.state.map[y][x];
  }

  isFinish(x, y) {
    return this.FINISH == this.state.map[y][x];
  }

  parseMap() {
    const walls = [];
    const doors = [];
    const keys = [];
    const finishes = [];
    let row;
    let symbol;
    let xPos;
    let yPos;
    let mapEl;
    for (yPos = 0; yPos < this.state.map.length; yPos++) {
      row = this.state.map[yPos].split('');
      for (xPos = 0; xPos < row.length; xPos++) {
        mapEl = { x: xPos, y: yPos, symbol: row[xPos] };
        if (this.isWall(xPos, yPos)) {
          walls.push(mapEl);
        } else if (this.isDoor(xPos, yPos)) {
          doors.push(mapEl);
        } else if (this.isKey(xPos, yPos)) {
          keys.push(mapEl);
        } else if (this.isFinish(xPos, yPos)) {
          finishes.push(mapEl);
        }
      }
    }

    this.setState({
      walls: walls,
      doors: doors,
      finishes: finishes,
      keys: keys,
    });
  }

  render() {
    if (!this.state.walls || !this.state.walls.length) {
      return false;
    }

    const walls = this.state.walls.map((el) => {
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
    });

    const doors = this.state.doors.map((el) => {
      return (
        <View key={`${el.x}:${el.y}`} style={{ flex: 1,
                       position: 'absolute',
                       left: el.x * this.props.cellWidth,
                       bottom: el.y * this.props.cellHeight,
                       width: this.props.cellWidth,
                       height: this.props.cellHeight,
                       backgroundColor: this.DOOR_COLORS[el.symbol]
                     }} />
      );
    });

    const keys = this.state.keys.map((el) => {
      return (
        <View key={`${el.x}:${el.y}`} style={{ flex: 1,
                       position: 'absolute',
                       left: el.x * this.props.cellWidth,
                       bottom: el.y * this.props.cellHeight,
                       width: this.props.cellWidth,
                       height: this.props.cellHeight
                     }} >
           <Image style={{ flex: 1,
                           width: undefined,
                           height: undefined,
                           backgroundColor:'transparent',
                           justifyContent: 'center',
                           alignItems: 'center',
                         }}
                   source={ this.KEY_IMAGES[el.symbol] } />
       </View>
      );
    });

    const finishes = this.state.finishes.map((el) => {
      return (
        <View key={`${el.x}:${el.y}`} style={{ flex: 1,
                       position: 'absolute',
                       left: el.x * this.props.cellWidth,
                       bottom: el.y * this.props.cellHeight,
                       width: this.props.cellWidth,
                       height: this.props.cellHeight,
                       backgroundColor: '#FFF'
                     }} />
      );
    });

    return (
      <View style={this.props.style}>
      {walls}
      {doors}
      {keys}
      {finishes}
      </View>
    )
  }

  setNativeProps(nativeProps) {
    this.setState({
      map: nativeProps.map
    });
    this.parseMap();
  }
}
