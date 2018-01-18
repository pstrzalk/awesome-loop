import React from 'react';
import { Image, View, TouchableWithoutFeedback } from 'react-native';
import { Loop, Stage } from 'react-game-kit/native';
import { maps } from './maps.js';
import { styles } from './styles.js';
import Hero from './hero.js';
import Maze from './maze.js';
import PropTypes from 'prop-types';
import {
  backgroundColor, gridCellHeight, gridCellWidth, gridHeight, gridWidth,
  heroWidth, heroHeight, iconWidth, iconHeight,
  stageWidth, stageHeight, wallColor, window,
} from './consts.js';

export default class Game extends React.Component {
  KEY_PICKUP_IMAGES = {
    a: require('./images/key-a.png'),
    b: require('./images/key-b.png'),
    c: require('./images/key-c.png'),
    d: require('./images/key-d.png'),
  }

  IMAGE_CHEST = require('./images/treasure-chest.png');
  IMAGE_FIREWORKS = require('./images/fireworks.gif');

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
     mode: 'levelComplete',

     map: maps[0].slice(0),

     animationProgress: 0,
     animationScale: 0,
     level: 0,
     items: [],

     pickUpImage: require('./images/knight.png'),
     t: new Date().getMilliseconds()
    };
  }

  changePosition(vector, vectorSecondary) {
    let deltaX = vector[0];
    let deltaY = vector[1];
    const x = this.state.position.x + deltaX;
    if (x < 0 || x > gridWidth - 1) {
      return vectorSecondary != [0, 0] ? this.changePosition(vectorSecondary, [0, 0]) : false;
    }
    const y = this.state.position.y + deltaY;
    if (y < 0 || y > gridHeight - 1) {
      return vectorSecondary != [0, 0] ? this.changePosition(vectorSecondary, [0, 0]) : false;
    }

    const mapSymbol = this.mapCell(x, y);

    if (this._maze.isWall(x, y)) {
      // WALL
      return vectorSecondary != [0, 0] ? this.changePosition(vectorSecondary, [0, 0]) : false;
    } else if (this._maze.isDoor(x, y)) {
      // DOOR
      let opened = false;

      // BRUTE FORCE TRY EACH ITEM TO OPEN
      this.state.items.forEach(item => {
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
      this.setState({ items: this.state.items.concat([mapSymbol]) });
      this.cleanMapPosition(x, y);
      this.setState({ mode: 'pickUp', pickUpImage: this.KEY_PICKUP_IMAGES[mapSymbol] });
    }

    // VICTORY POINT
    if (this._maze.isFinish(x, y)) {
      this.setState({ mode: 'levelComplete' })
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
    let vectorSecondary = [0, 0];

    if (deltaX >= deltaY && this.state.position.x < gridX) {
      // Go Right
      if (this.state.position.y > gridY) {
        vectorSecondary = [0, -1];
      } else if (this.state.position.y < gridY) {
        vectorSecondary = [0, 1];
      }
      return this.changePosition([1, 0], vectorSecondary);
    } else if (deltaX >= deltaY && this.state.position.x > gridX) {
      // Go Left
      if (this.state.position.y > gridY) {
        vectorSecondary = [0, -1];
      } else if (this.state.position.y < gridY) {
        vectorSecondary = [0, 1];
      }
      return this.changePosition([-1, 0], vectorSecondary);
    } else if (deltaX < deltaY && this.state.position.y > gridY) {
      // Go Down
      if (this.state.position.x < gridX) {
        vectorSecondary = [1, 0];
      } else if (this.state.position.x > gridX) {
        vectorSecondary = [-1, 0];
      }
      return this.changePosition([0, -1], vectorSecondary);
    } else if (deltaX < deltaY && this.state.position.y < gridY) {
      // Go Up
      if (this.state.position.x < gridX) {
        vectorSecondary = [1, 0];
      } else if (this.state.position.x > gridX) {
        vectorSecondary = [-1, 0];
      }
      return this.changePosition([0, 1], vectorSecondary);
    }
  }

  restart = (ev) => {
    this.setState({
      map: maps[0].slice(0),
      mode: 'levelComplete',
      items: [],
      level: 0,
      animationProgress: 0,
      position: { x: 0, y: 0 }
    });
  }

  update = () => {
    const newT = new Date().getMilliseconds();
    let dt;
    if (this.state.t > newT) {
      dt = 1000 - this.state.t + newT;
    } else {
      dt = newT - this.state.t;
    }
    dt = Math.min(dt, 40);

    if (this.state.mode == 'pickUp') {
      let newAnimationProgress;
      if (this.state.animationProgress >= 6.28) {
        newAnimationProgress = 0;
        this.setState({ mode: 'game' });
      } else {
        newAnimationProgress = this.state.animationProgress + dt/300;
      }

      this.setState({
        animationProgress: newAnimationProgress,
        animationScale: Math.abs(Math.sin(newAnimationProgress)),
        t: newT
      });
    } else if (this.state.mode == 'levelComplete') {
      if (this.state.animationProgress < 1) {
        this.setState({
          animationProgress: this.state.animationProgress + dt/1000,
          t: newT
        });
      } else {
        const nextLevel = this.state.level + 1;
        if (maps[nextLevel]) {
          this.setState({
            map: maps[nextLevel].slice(0),
            mode: 'game',
            items: [],
            level: nextLevel,
            animationProgress: 0,
            position: { x: 0, y: 0 },
            t: newT
          });
        } else {
          this.setState({
            map: maps[0].slice(0),
            mode: 'win',
            items: [],
            level: 0,
            animationProgress: 0,
            position: { x: 0, y: 0 },
            t: newT
          });
        }
      }
    } else if (this.state.mode == 'win') {
      this.setState({
        t: newT
      });
    } else {
      this.setState({
        t: newT
      });
    }
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
    if (this.state.mode == 'pickUp') {
      return this.renderPickUp();
    } else if (this.state.mode == 'levelComplete') {
      return this.renderLevelComplete();
    } else if (this.state.mode == 'win') {
      return this.renderWin();
    } else {
      return this.renderGame();
    }
  }

  renderWin() {
    return (
      <TouchableWithoutFeedback style={ styles.fullWindow } onPress={ (ev) => this.restart(ev) } >
        <View style={ styles.winWindow }>
          <View style={{ width: window.width, height: window.height, }}>
            <Image
              style={{
                flex: 1,
                width: undefined,
                height: undefined,
                backgroundColor: 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              source={ this.IMAGE_FIREWORKS } />
            <Image
              style={{
                flex: 1,
                position: 'absolute',
                width: 300,
                height: 220,
                left: (window.width - 150) / 2,
                top: (window.height - 110) / 2
              }}
              source={ this.IMAGE_CHEST } />
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderPickUp() {
    return (
      <View style={ styles.pickUpWindow }>
        <View style={{
                width: 200 * (1 - 0.3 * this.state.animationScale),
                height: 200 * (1 - 0.3 * this.state.animationScale),
                left: (window.width / 2 - 100) + 30 * this.state.animationScale,
                top: (window.height / 2 - 100) + 30 * this.state.animationScale
              }}>
        <Image
          style={{
            flex: 1,
            width: undefined,
            height: undefined,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          source={ this.state.pickUpImage } />
        </View>
      </View>
    );
  }

  renderLevelComplete() {
    return (
      <View style={ styles.toucharea }>
        <View style={ styles.fullWindow }>
          <Image
            style={{
              left: window.width * this.context.scale * this.state.animationProgress,
              flex: 1,
              width: 300,
              height: 300,
              backgroundColor:'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            source={ require('./images/knight.png') } />
        </View>
      </View>
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
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
