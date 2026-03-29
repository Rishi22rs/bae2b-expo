import {StyleSheet} from 'react-native';
import {hexToRgbA} from '../../utils/hexToRgba';

export const createStyleSheet = () => {
  return StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    profileImage: {
      height: 200,
      width: 200,
      alignSelf: 'center',
      justifyContent: 'center',
      borderRadius: 100,
    },
    cta: {
      marginTop: 16,
      width: '100%',
    },
    image: {
      height: 100,
      width: 100,
    },
    labelStyle: {
      alignSelf: 'flex-start',
      fontSize: 14,
      fontWeight: '600',
      color: hexToRgbA('#000000', 80),
      marginBottom: 8,
    },
    chipContainer: {
      flexWrap: 'wrap',
      flexDirection: 'row',
      gap: 8,
      marginTop: 8,
    },
  });
};
