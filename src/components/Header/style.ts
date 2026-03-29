import {StyleSheet} from 'react-native';
import {hexToRgbA} from '../../utils/hexToRgba';

export const createStyleSheet = () => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      width: '100%',
      height: 72,
      backgroundColor: 'white',
      paddingHorizontal: 16,
    },
    title: {
      fontSize: 32,
      fontWeight: '400',
      marginTop: -4,
    },
    preTitle: {
      fontSize: 14,
      fontWeight: 400,
      color: hexToRgbA('#000', 60),
    },
    locationContainer: {
      flexDirection: 'row',
    },
    locationText: {
      marginTop: 6,
      fontSize: 12,
      fontWeight: 400,
      color: '#606060',
    },
    locationIcon: {
      marginTop: 5,
      marginRight: 2,
    },
    bottomArrow: {
      marginTop: 2,
    },
    backAndTitleContainer: {
      flexDirection: 'row',
    },
    backIcon: {
      paddingVertical: 12,
      paddingHorizontal: 8,
    },
  });
};
