import {StyleSheet} from 'react-native';
import {defaultTheme} from '../../config/theme';

export const createStyleSheet = () => {
  return StyleSheet.create({
    navigateButton: {
      paddingHorizontal: 62,
      paddingVertical: 18,
      backgroundColor: defaultTheme.brown,
      borderRadius: 16,
      alignItems: 'center',
    },
    navigate: {
      fontSize: 16,
      fontWeight: 700,
      color: 'white',
    },
    text: {
      fontSize: 14,
      fontWeight: '600',
      color: 'white',
    },
    logoutButton: {
      marginTop: 20,
      padding: 14,
      borderRadius: 12,
    },
    logoutContent: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
    },
    logoutText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });
};
