import {StyleSheet} from 'react-native';
import {defaultTheme} from '../../config/theme';
import {hexToRgbA} from '../../utils/hexToRgba';

export const createStyleSheet = () => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconStyle: {
      color: '#B8B8B8',
      marginBottom: 6,
    },
    textInput: {
      fontSize: 13,
      color: defaultTheme.brown,
      flex: 1,
      borderWidth: 1,
      borderColor: hexToRgbA(defaultTheme.brown, 0.1),
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      paddingHorizontal: 16,
    },
  });
};
