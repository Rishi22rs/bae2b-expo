import {StyleSheet} from 'react-native';
import {defaultTheme} from '../../config/theme';

export const createStyleSheet = () => {
  return StyleSheet.create({
    loaderContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      paddingHorizontal: 24,
      gap: 12,
    },
    loaderText: {
      color: defaultTheme.mutedText,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500',
      textAlign: 'center',
    },
    errorText: {
      color: '#b91c1c',
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500',
      textAlign: 'center',
    },
    retryButton: {
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: defaultTheme.pinkPrimary,
      marginTop: 4,
    },
    retryButtonText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '500',
    },
  });
};
