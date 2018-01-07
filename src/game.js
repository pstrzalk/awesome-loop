import React from 'react';
import { StyleSheet, Image, View, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Loop, Stage } from 'react-game-kit/native';
import PropTypes from 'prop-types';
import Hero from './hero.js';
import Inventory from './inventory.js';
import Maze from './maze.js';

const window = { width: Dimensions.get('window').width, height: Dimensions.get('window').height };
const backgroundColor = '#A7DB1A';
const wallColor = '#A7DB1A';

const heroWidth = 35;
const heroHeight = 35;
const stageWidth = 1024;
const stageHeight = 576;
const gridWidth = 20;
const gridHeight = 10;

const gridCellWidth = stageWidth / gridWidth;
const gridCellHeight = stageHeight / gridHeight;
const iconWidth = 2 * gridCellWidth;
const iconHeight = 2 * gridCellHeight;

export default class Game extends React.Component {
  setNativeProps = (nativeProps) => {
    this._root.setNativeProps(nativeProps);
  }

  static contextTypes = {
    loop: PropTypes.object,
    scale: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
     position: { x: 0, y: 0 },
     iW: iconWidth,
     iH: iconHeight,
     map: [
       '00011111111111111111',
       '00011100001111101001',
       '00001111101111000011',
       '01101111101111011011',
       '91101111100000011011',
       '01101111101111111011',
       'A1001111101110111011',
       'B1011111101000111011',
       'C1000000000011111001',
       '00000cba000000000000',
     ]
    };
  }

  changePosition(deltaX, deltaY) {
    const xTo = this.state.position.x + deltaX;
    if (xTo < 0 || xTo > gridWidth - 1) {
      return false;
    }
    const yTo = this.state.position.y + deltaY;
    if (yTo < 0 || yTo > gridHeight - 1) {
      return false;
    }

    const moveTarget = this.mapCell(xTo, yTo);

    // WALL?
    if (moveTarget == '1') {
      return false;
    }

    this.setState({
      position: { x: xTo, y: yTo }
    });

    this.collectItem(moveTarget);

    // VICTORY POINT
    if (moveTarget == 9) {
      console.log('YOU WIN!');
    }
    return true;
  }

  collectItem(mapItem) {
    if (['A', 'B', 'C'].indexOf(mapItem) !== -1) {
      // Found key
      this._inventory.add(mapItem);
      return true;
    }

    return false;
  }

  go(ev) {
    const gridX = Math.floor(ev.nativeEvent.pageX / this.state.gcW);
    const gridY = Math.floor((window.height - ev.nativeEvent.pageY) / this.state.gcH);
    const deltaX = Math.abs(this.state.position.x - gridX);
    const deltaY = Math.abs(this.state.position.y - gridY);

    if (deltaX >= deltaY && this.state.position.x < gridX) {
      // Go Right
      return this.changePosition(1, 0);
    } else if (deltaX >= deltaY && this.state.position.x > gridX) {
      // Go Left
      return this.changePosition(-1, 0);
    } else if (deltaX < deltaY && this.state.position.y > gridY) {
      // Go Down
      return this.changePosition(0, -1);
    } else if (deltaX < deltaY && this.state.position.y < gridY) {
      // Go Up
      return this.changePosition(0, 1);
    }
  }


  update = () => {
    // console.log('update', this.state.map);
    // this.setState({
    //   map: [
    //     Math.round(Math.random()) + '0011111111111111111',
    //     '00011100001111101001',
    //     '00001111101111000011',
    //     '11101111101111011011',
    //     '11101111100000011011',
    //     '11101111101111111011',
    //     '11001111101110111011',
    //     '11011111101000111011',
    //     '11000000000011111001',
    //     '11111111111111111100',
    //   ]
    // });
    // this._maze.setNativeProps({map: this.state.map});
  }

  mapCell(x, y) {
    return this.state.map[y][x];
  }

  componentDidMount() {
    this.context.loop.subscribe(this.update);
    this.setState({
      gcH: gridCellHeight * this.context.scale,
      gcW: gridCellWidth * this.context.scale
    });
  }


  componentWillUnmount() {
    this.context.loop.unsubscribe(this.update);
  }

  render() {
    pos = this.state.position;

    return (
      <TouchableWithoutFeedback style={ styles.fullWindow } onPress={ (ev) => this.go(ev) } >
        <View style={ styles.toucharea }>
          <Maze style={ styles.fullWindow }
                ref={component => this._maze = component}
                cellWidth={gridCellWidth * this.context.scale}
                cellHeight={gridCellHeight * this.context.scale}
                map={this.state.map}
                color="#CA5612"
                />
          <Hero ref={component => this._hero = component}
                width={gridCellWidth * this.context.scale}
                height={gridCellHeight * this.context.scale}
                style={{
                  position: 'absolute',
                  left: Math.floor(pos.x * gridCellWidth * this.context.scale),
                  bottom: Math.floor(pos.y * gridCellHeight * this.context.scale),
                  backgroundColor: backgroundColor
                }} />
        </View>
        <Inventory style={styles.inventory}
                   ref={component => this._inventory = component} />
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  inventory: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: '#999'
  },

  fullWindow: {
    flex: 1,
    width: window.width,
    height: window.height
  },

  toucharea: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: backgroundColor
  },
});
