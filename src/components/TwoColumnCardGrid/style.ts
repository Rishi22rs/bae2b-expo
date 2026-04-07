import {StyleSheet} from 'react-native';
import {hexToRgbA} from '../../utils/hexToRgba';

export const createStyleSheet = () => {
  return StyleSheet.create({
    flex: {
      flex: 1,
    },
    contentContainer: {
      paddingBottom: 32,
    },
    row: {
      justifyContent: 'space-between',
    },
    cardCell: {
      flex: 1,
      marginBottom: 14,
    },
    leftCard: {
      marginRight: 7,
    },
    rightCard: {
      marginLeft: 7,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
      paddingHorizontal: 20,
    },
    emptyText: {
      fontSize: 14,
      color: hexToRgbA('#000000', 60),
      textAlign: 'center',
      fontWeight: '500',
    },
  });
};
