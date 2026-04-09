import {StyleSheet} from 'react-native';
import {screenWidth} from '../../utils/dimensions';
import {defaultTheme} from '../../config/theme';
import {hexToRgbA} from '../../utils/hexToRgba';

export const createStyleSheet = () => {
  return StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
    },
    loginContainer: {
      position: 'absolute',
      left: 16,
      right: 16,
      bottom: 16,
      width: screenWidth - 32,
      paddingVertical: 32,
      paddingHorizontal: 32,
      borderRadius: 16,
    },
    buttonText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 14,
      lineHeight: 20,
    },
    title: {
      color: 'white',
      fontWeight: '700',
      fontSize: 40,
      top: 180,
    },
    input: {
      marginBottom: 16,
    },
    loginTitle: {
      color: '#303237',
      fontWeight: '600',
      fontSize: 24,
      lineHeight: 20,
      marginBottom: 8,
    },
    loginSubTitle: {
      color: hexToRgbA('#303237', 70),
      fontWeight: '400',
      fontSize: 14,
      lineHeight: 18,
      marginBottom: 16,
    },
    otpContainer: {
      marginVertical: 30,
    },
    statusRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: -12,
      marginBottom: 12,
      gap: 12,
    },
    timerText: {
      color: defaultTheme.mutedText,
      fontWeight: '600',
      fontSize: 13,
      lineHeight: 18,
      flex: 1,
    },
    attemptsText: {
      color: defaultTheme.pinkText,
      fontWeight: '700',
      fontSize: 12,
      lineHeight: 16,
      textAlign: 'right',
    },
    resendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
      gap: 8,
    },
    loginSubTitleCompact: {
      color: hexToRgbA('#303237', 70),
      fontWeight: '400',
      fontSize: 14,
      lineHeight: 18,
      marginBottom: 0,
      flex: 1,
    },
    resendButton: {
      paddingVertical: 4,
      paddingHorizontal: 2,
    },
    resendText: {
      color: defaultTheme.pinkPrimary,
      fontWeight: '700',
      fontSize: 14,
      lineHeight: 18,
    },
    resendTextDisabled: {
      color: hexToRgbA(defaultTheme.black, 45),
    },
    infoMessage: {
      color: '#0f766e',
      fontWeight: '500',
      fontSize: 13,
      lineHeight: 18,
      marginBottom: 8,
    },
    errorText: {
      color: '#b91c1c',
      fontWeight: '500',
      fontSize: 13,
      lineHeight: 18,
      marginBottom: 8,
    },
    titleBackContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      marginBottom: 16,
      marginLeft: -4,
    },
    backBtn: {
      marginBottom: 8,
    },
    carouselTitle: {
      fontSize: 32,
      textAlign: 'center',
      color: defaultTheme.black,
      fontWeight: '600',
      marginBottom: 16,
    },
    carouselSubTitle: {
      fontSize: 16,
      textAlign: 'center',
      color: hexToRgbA(defaultTheme.black, 60),
      fontWeight: '400',
    },
    textContainer: {
      paddingHorizontal: 64,
      marginTop: 32,
    },
    loginOtpContainer: {
      paddingHorizontal: 16,
      paddingTop: 32,
      backgroundColor: 'white',
    },
  });
};
