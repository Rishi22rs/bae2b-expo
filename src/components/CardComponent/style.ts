import {Dimensions, Platform, StyleSheet} from 'react-native';
import {hexToRgbA} from '../../utils/hexToRgba';
import {defaultTheme} from '../../config/theme';

export const createStyleSheet = () => {
  const dimesions = Dimensions.get('window');
  return StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: defaultTheme.cream,
      borderRadius: 10,
      width: '100%',
    },
    cardHeading: {
      fontWeight: '500',
      fontSize: 14,
      color: hexToRgbA('#000000', 70),
    },
  });
};
