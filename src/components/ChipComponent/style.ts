import {StyleSheet} from 'react-native';
import {hexToRgbA} from '../../utils/hexToRgba';
import {defaultTheme} from '../../config/theme';

export const createStyleSheet = () => {
  return StyleSheet.create({
    defaultStyle: {
      borderRadius: 8,
      backgroundColor: '#ffffff',
      borderColor: hexToRgbA(defaultTheme.brown, 0.2),
      borderWidth: 0.4,
      flexDirection: 'row',
      alignItems: 'center',
    },
    defaultLabel: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      fontFamily: '400',
      fontSize: 10,
      color: hexToRgbA('#000000', 80),
      lineHeight: 12,
    },
    selectedChip: {
      borderWidth: 1,
      borderColor: '#f96163',
    },
  });
};
