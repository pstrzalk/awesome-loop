import React from 'react';
import { StyleSheet, Image, View, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Loop, Stage } from 'react-game-kit/native';
import PropTypes from 'prop-types';
import Hero from './hero.js';
import Inventory from './inventory.js';
import Maze from './maze.js';

const window = { width: Dimensions.get('window').width, height: Dimensions.get('window').height };
const backgroundColor = '#363636';
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

const zeroLevelMap = [
  '00011111111111111111',
  '0001110c001111101091',
  '11001111101111000011',
  '111010a1101111011011',
  '11100011100B00011011',
  '11101111101111111011',
  '11001111101110b11C11',
  '11011111101000111011',
  '110A0000000011111001',
  '11111111111111111111',
];

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
     map: zeroLevelMap.slice(0),
     mode: 'levelEnd',
     levelEndProgress: 0
    };
  }

  changePosition(deltaX, deltaY) {
    const x = this.state.position.x + deltaX;
    if (x < 0 || x > gridWidth - 1) {
      return false;
    }
    const y = this.state.position.y + deltaY;
    if (y < 0 || y > gridHeight - 1) {
      return false;
    }

    const mapSymbol = this.mapCell(x, y);

    if (this._maze.isWall(x, y)) {
      // WALL
      return false;
    } else if (this._maze.isDoor(x, y)) {
      // DOOR
      let opened = false;

      // BRUTE FORCE TRY EACH ITEM TO OPEN
      this._inventory.items().forEach(item => {
        if (this._maze.canOpenDoor(x, y, item)) {
          opened = true;
        }
      });
      if (opened) {
        // Mark as opened on map
        this.cleanMapPosition(x, y);
      } else {
        // You shall not pass
        return false;
      }
    }

    this.setState({ position: { x: x, y: y } });

    if (this._maze.isPickable(x, y)) {
      this._inventory.add(mapSymbol);
      this.cleanMapPosition(x, y);
    }

    // VICTORY POINT
    if (this._maze.isFinish(x, y)) {
      console.log('YOU WIN!');
      this.setState({ mode: 'levelEnd' })
    }
    return true;
  }

  cleanMapPosition(x, y) {
    const newMap = this.state.map;
    const newMapRow = newMap[y];
    newMap[y] = newMap[y].split('');
    newMap[y][x] = this._maze.PASS;
    newMap[y] = newMap[y].join('');

    this.setState({map: newMap});
    this._maze.setNativeProps({map: newMap});
    return true;
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
    if (this.state.mode == 'levelEnd') {
      if (this.state.levelEndProgress < 1) {
        this.setState({
          levelEndProgress: this.state.levelEndProgress + 0.02
        })
      } else {
        this.setState({
          map: zeroLevelMap.slice(0),
          mode: 'game',
          levelEndProgress: 0,
          position: { x: 0, y: 0 }
        });
        this._inventory.clear();
      }
    }    // this._maze.setNativeProps({map: this.state.map});
  }

  nextLevel() {

  }

  mapCell(x, y) {
    return this.state.map[y][x];
  }

  map() {

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
    if (this.state.mode == 'levelEnd') {
      return this.renderLevelEnd();
    }
    return this.renderGame();
  }

  renderLevelEnd() {
    return (
      <TouchableWithoutFeedback style={ styles.fullWindow } onPress={ (ev) => this.onLevelFinish(ev) } >
        <View style={ styles.toucharea }>
          <Image
            style={{
              left: window.width * this.context.scale * this.state.levelEndProgress,
              flex: 1,
              width: 300,
              height: 300,
              backgroundColor:'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            source={ require('./images/knight.png') } />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderGame() {
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
                  left: Math.floor(this.state.position.x * gridCellWidth * this.context.scale),
                  bottom: Math.floor(this.state.position.y * gridCellHeight * this.context.scale),
                  backgroundColor: backgroundColor
                }} />
          <Inventory style={styles.inventory}
                     ref={component => this._inventory = component} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  inventory: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: '#000',
    display: 'none'
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
