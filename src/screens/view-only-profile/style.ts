import {StyleSheet} from 'react-native';
import {screenHeight, screenWidth} from '../../utils/dimensions';
import {hexToRgbA} from '../../utils/hexToRgba';
import {defaultTheme} from '../../config/theme';

export const createStyleSheet = () => {
  return StyleSheet.create({
    background: {
      // flex: 1,
      backgroundColor: 'white',
    },
    seperator: {
      borderBottomWidth: 1,
      borderBottomColor: hexToRgbA(defaultTheme.brown, 0.05),
      width: '100%',
      marginTop: 16,
      marginBottom: -8,
    },

    container: {
      paddingHorizontal: 0,
      backgroundColor: '#fff',
      paddingBottom: screenHeight / 3,
    },
    imageContainer: {
      position: 'relative',
    },
    profileImage: {
      width: '100%',
      height: screenHeight / 2,
      borderBottomLeftRadius: 40,
      borderBottomRightRadius: 40,
    },
    backBtn: {
      position: 'absolute',
      top: 30,
      left: 20,
      backgroundColor: '#fff',
      borderRadius: 20,
      padding: 6,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginTop: -30,
    },
    circleButton: {
      width: 60,
      height: 60,
      backgroundColor: '#fff',
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    circleButtonBig: {
      width: 70,
      height: 70,
      backgroundColor: '#fff',
      borderRadius: 35,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: hexToRgbA('#000000', 6),
      borderWidth: 1,
    },
    profileInfo: {
      paddingHorizontal: 24,
      paddingTop: 16,
    },
    nameRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: defaultTheme.brown,
    },
    subtitle: {
      color: '#888',
      marginTop: 4,
    },
    chatIcon: {
      backgroundColor: '#ff2d55',
      padding: 10,
      borderRadius: 12,
    },
    sectionTitle: {
      fontWeight: 'bold',
      marginTop: 24,
      marginBottom: 8,
      fontSize: 16,
      color: defaultTheme.brown,
    },
    aboutText: {
      color: '#555',
      lineHeight: 20,
    },
    readMore: {
      color: '#ff2d55',
    },
    interestsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    interestPill: {
      backgroundColor: '#f1f1f1',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      margin: 4,
    },
    interestText: {
      fontSize: 14,
      color: '#333',
    },
    linearGradient: {
      flex: 1,
      paddingLeft: 15,
      paddingRight: 15,
      borderRadius: 5,
    },
    info: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 20,
      alignItems: 'flex-end',
      height: '100%',
      paddingBottom: 60,
    },
    more: {
      fontSize: 26,
      color: 'white',
    },
    likeUnlikeView: {
      backgroundColor: 'white',
      // flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    userDetailImageTop: {
      position: 'absolute',
      bottom: 0,
      paddingHorizontal: 16,
      paddingVertical: 50,
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    userDetailImageTopText: {
      color: defaultTheme.cream,
      fontWeight: '700',
      fontSize: 30,
    },
    fullscreenOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 999,
      backgroundColor: 'rgba(0,0,0,0.4)', // optional: slight dim effect
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
