import {StyleSheet} from 'react-native';
import {screenWidth} from '../../utils/dimensions';

export const createStyleSheet = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: 'white',
      paddingTop: 60,
      paddingHorizontal: 20,
    },
    heartWrapper: {
      alignItems: 'center',
      marginBottom: 20,
    },
    heartCircle: {
      backgroundColor: '#fff0f7',
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      shadowOffset: {width: 0, height: 2},
    },
    heartText: {
      fontSize: 24,
    },
    cardContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 20,
    },
    cardImage: {
      width: screenWidth * 0.35,
      height: screenWidth * 0.45,
      borderRadius: 16,
      marginHorizontal: -10,
      resizeMode: 'cover',
    },
    title: {
      fontSize: 32,
      fontFamily: 'Cochin',
      color: '#f05b7f',
      fontWeight: '600',
    },
    subtitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 8,
      color: '#f05b7f',
    },
    description: {
      color: 'gray',
      textAlign: 'center',
      marginVertical: 8,
    },
    sayHelloButton: {
      width: '100%',
      paddingVertical: 14,
      borderRadius: 10,
      marginTop: 24,
      alignItems: 'center',
    },
    sayHelloText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    keepSwipingButton: {
      marginTop: 16,
      borderWidth: 1,
      borderColor: '#ff5c8d',
      paddingVertical: 14,
      borderRadius: 10,
      width: '100%',
      alignItems: 'center',
    },
    keepSwipingText: {
      color: '#ff5c8d',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
