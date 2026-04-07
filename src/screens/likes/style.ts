import {StyleSheet} from 'react-native';
import {hexToRgbA} from '../../utils/hexToRgba';

export const createStyleSheet = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    body: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 10,
    },
    subtitle: {
      fontSize: 13,
      color: hexToRgbA('#000000', 56),
      marginBottom: 16,
      paddingHorizontal: 4,
      lineHeight: 20,
      fontWeight: '500',
    },
    loaderWrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorBanner: {
      marginHorizontal: 4,
      marginBottom: 12,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#fee2e2',
      backgroundColor: '#fff5f5',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 10,
    },
    errorText: {
      color: '#9f1239',
      fontSize: 12,
      flex: 1,
      fontWeight: '600',
    },
    retryButton: {
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 7,
      backgroundColor: '#0f172a',
    },
    retryButtonText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '700',
    },
  });
};
