import { StyleSheet } from 'react-native';
import { backgroundColor, window } from './consts.js'

const styles = StyleSheet.create({
  fullWindow: {
    flex: 1,
    width: window.width,
    height: window.height
  },

  goldCounter: {
    position: 'absolute',
    right: 5,
    top: 5,
    height: 28,
    flexDirection: 'row'
  },

  goldCounterImage: {
    width: 43,
    height: 26
  },

  goldCounterValue: {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 24,
    marginRight: 10
  },

  mazeCellImage: {
    flex: 1,
    width: undefined,
    height: undefined,
    backgroundColor:'transparent',
    justifyContent: 'center',
    alignItems: 'center'
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
