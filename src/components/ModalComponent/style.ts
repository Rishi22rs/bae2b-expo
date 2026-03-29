import {StyleSheet} from 'react-native';
import {defaultTheme} from '../../config/theme';

export const createStyleSheet = () => {
  return StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: 'white',
      padding: 16,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 34,
      fontWeight: '600',
      color: defaultTheme.brown,
    },
  });
};
