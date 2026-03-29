import {StyleSheet} from 'react-native';
import {defaultTheme} from '../../config/theme';
import {hexToRgbA} from '../../utils/hexToRgba';

export const createStyleSheet = () =>
  StyleSheet.create({
    background: {
      paddingHorizontal: 16,
      backgroundColor: 'white',
      paddingTop: 16,
    },
    wrapper: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      paddingTop: 48, // adjust for status bar
      paddingHorizontal: 16,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    },
    content: {
      flex: 1,
      marginTop: 100, // leaves space for header
      paddingHorizontal: 24,
      justifyContent: 'center',
    },
    stepper: {
      marginBottom: 12,
    },
    stepText: {
      fontSize: 16,
      color: '#888',
    },
    container: {
      gap: 16,
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      marginBottom: 8,
      color: defaultTheme.brown,
    },
    genderButton: {
      padding: 12,
      marginVertical: 4,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
    },
    genderButtonSelected: {
      backgroundColor: '#eee',
    },
    continueButton: {
      marginTop: 24,
      backgroundColor: defaultTheme.orange,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    continueText: {
      color: 'white',
      fontSize: 16,
    },
    chipContainer: {
      flexWrap: 'wrap',
      flexDirection: 'row',
      gap: 8,
      marginTop: 8,
    },
    dateInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: hexToRgbA(defaultTheme.brown, 0.1),
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 24,
    },
    backIcon: {
      paddingVertical: 12,
    },
    backBtn: {
      paddingBottom: 24,
      marginLeft: -8,
    },
  });
