import {Platform, StyleSheet} from 'react-native';
import {defaultTheme} from '../../config/theme';
import {hexToRgbA} from '../../utils/hexToRgba';

export const createStyleSheet = () => {
  return StyleSheet.create({
    fieldWrapper: {
      width: '100%',
    },
    label: {
      color: hexToRgbA(defaultTheme.black, 80),
      fontSize: 13,
      fontWeight: '600',
      marginBottom: 8,
    },
    labelError: {
      color: '#ef4444',
    },
    requiredMark: {
      color: '#ef4444',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 52,
      borderWidth: 1,
      borderRadius: 14,
      borderColor: hexToRgbA(defaultTheme.black, 14),
      backgroundColor: '#fff',
      paddingHorizontal: 14,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.04,
      shadowRadius: 2,
      elevation: 1,
      ...(Platform.OS === 'web'
        ? ({
            transitionProperty: 'border-color, box-shadow',
            transitionDuration: '160ms',
            transitionTimingFunction: 'ease',
          } as object)
        : null),
    },
    inputContainerFocused: {
      borderColor: defaultTheme.orange,
      ...(Platform.OS === 'web'
        ? ({
            boxShadow: `0 0 0 3px ${hexToRgbA(defaultTheme.orange, 18)}`,
          } as object)
        : null),
    },
    inputContainerError: {
      borderColor: '#ef4444',
      ...(Platform.OS === 'web'
        ? ({
            boxShadow: '0 0 0 3px rgba(239,68,68,0.14)',
          } as object)
        : null),
    },
    iconStyle: {
      color: hexToRgbA(defaultTheme.black, 35),
      marginRight: 8,
    },
    textInput: {
      fontSize: 15,
      color: defaultTheme.brown,
      flex: 1,
      paddingVertical: 14,
    },
    textInputMultiline: {
      minHeight: 108,
      textAlignVertical: 'top',
      paddingVertical: 12,
    },
    errorText: {
      marginTop: 6,
      color: '#ef4444',
      fontSize: 12,
      lineHeight: 16,
    },
  });
};
