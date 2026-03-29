import {StyleSheet} from 'react-native';
import {hexToRgbA} from '../../utils/hexToRgba';

export const createStyleSheet = () => {
  return StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      zIndex: 100,
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      backgroundColor: hexToRgbA('#ffffff', 60),
    },
    circle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#6C5CE7',
    },
  });
};
