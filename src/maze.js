import React from 'react';
import { StyleSheet, Image, View, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { styles } from './styles.js';

export default class Maze extends React.Component {
  WALL = '1';
  GOLD = 'g';
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
  GOLD_IMAGE = require('./images/gold.gif');
  PASS = '0';
  ROOT_IMAGES = [
    require('./images/roots_1.png'),
    require('./images/roots_2.png'),
    require('./images/roots_3.png'),
    require('./images/roots_4.png'),
    require('./images/roots_5.png')
  ];
  START = '0';
  FINISH = '9';

  canOpenDoor(x, y, key) {
    if (this.isDoor(x, y) && this.mapCell(x, y).toUpperCase() == key.toUpperCase()) {
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
      doors: [],
      golds: [],
      keys: [],
      walls: []
    })
  }

  constructor(props) {
    super(props);
    this.state = { map: this.props.map};
  }

  componentDidMount() {
    this.parseMap();
  }

  isGold(x, y) {
    return this.GOLD === this.mapCell(x, y);
  }

  isDoor(x, y) {
    return this.DOORS.indexOf(this.mapCell(x, y)) !== -1;
  }

  isKey(x, y) {
    return this.KEYS.indexOf(this.mapCell(x, y)) !== -1;
  }

  isPickable(x, y) {
    return this.isKey(x, y);
  }

  isWall(x, y) {
    return this.WALL == this.mapCell(x, y);
  }

  isFinish(x, y) {
    return this.FINISH == this.mapCell(x, y);
  }

  mapCell(x, y) {
    return this.state.map[y][x];
  }

  parseMap() {
    const doors = [];
    const finishes = [];
    const golds = [];
    const keys = [];
    const walls = [];
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
          if (Math.random() < 0.1) {
            mapEl.diverse = true;
          }
          walls.push(mapEl);
        } else if (this.isDoor(xPos, yPos)) {
          doors.push(mapEl);
        } else if (this.isKey(xPos, yPos)) {
          keys.push(mapEl);
        } else if (this.isGold(xPos, yPos)) {
          golds.push(mapEl);
        } else if (this.isFinish(xPos, yPos)) {
          finishes.push(mapEl);
        }
      }
    }

    this.setState({
      doors: doors,
      finishes: finishes,
      keys: keys,
      golds: golds,
      walls: walls
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
                     }}>
           {el.diverse ? (<Image source={ this.ROOT_IMAGES[0] }
                                 style={{ flex: 1,
                                          width: this.props.cellWidth,
                                          height: this.props.cellHeight
                                        }} />) : null}
         </View>
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
           <Image style={ styles.mazeCellImage } source={ this.KEY_IMAGES[el.symbol] } />
       </View>
      );
    });

    const golds = this.state.golds.map((el) => {
      return (
        <View key={`${el.x}:${el  .y}`} style={{ flex: 1,
                       position: 'absolute',
                       left: el.x * this.props.cellWidth + this.props.cellWidth / 4,
                       bottom: el.y * this.props.cellHeight + this.props.cellHeight / 4,
                       width: this.props.cellWidth / 2,
                       height: this.props.cellHeight / 2
                     }} >
           <Image style={ styles.mazeCellImage } source={ this.GOLD_IMAGE } />
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
      {doors}
      {finishes}
      {golds}
      {keys}
      {walls}
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
