import React from 'react';
import { StyleSheet, Image, View, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Loop, Stage, World } from 'react-game-kit/native';
import PropTypes from 'prop-types';
import Game from './src/game.js';

const heroWidth = 35;
const heroHeight = 35;
const stageWidth = 1024;
const stageHeight = 576;
const minHeroX = 0;
const minHeroY = 0;
const maxHeroX = stageWidth - heroWidth;
const maxHeroY = stageHeight - heroHeight;
const startHeroX = 10;
const startHeroY = 0;
const heroSpeed = 2;

const gridWidth = 20;
const gridHeight = 10;
const gridCellWidth = stageWidth / gridWidth;
const gridCellHeight = stageHeight / gridHeight;


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     position: { x: 0, y: 0 },
     direction: { x: 1, y: 0 }
    };
  }

  render() {
    return (
        <Loop style={{ flex: 1,
                       width: window.width,
                       height: window.height,
                       backgroundColor: '#9999FF'
                     }}>
          <Stage
            width={stageWidth}  height={stageHeight}
            style={{ backgroundColor: '#FF9999'  }}>
            <Game />
          </Stage>
        </Loop>
    )
  }
}
