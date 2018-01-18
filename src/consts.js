import { Dimensions } from 'react-native';

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

export {
  backgroundColor,
  gridCellHeight,
  gridCellWidth,
  gridHeight,
  gridWidth,
  heroWidth,
  heroHeight,
  iconWidth,
  iconHeight,
  stageWidth,
  stageHeight,
  wallColor,
  window,
}
