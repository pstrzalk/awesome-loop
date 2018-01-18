import { StyleSheet } from 'react-native';
import { backgroundColor, window } from './consts.js'

const styles = StyleSheet.create({
  fullWindow: {
    flex: 1,
    width: window.width,
    height: window.height
  },

  pickUpWindow: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: backgroundColor
  },

  winWindow: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: backgroundColor
  },

  toucharea: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: backgroundColor
  },
});

export {
  styles
}
