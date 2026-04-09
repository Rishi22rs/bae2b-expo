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
      fontWeight: '500',
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
      ...(Platform.OS === 'web'
        ? ({
            transitionProperty: 'border-color',
            transitionDuration: '160ms',
            transitionTimingFunction: 'ease',
          } as object)
        : null),
    },
    inputContainerFocused: {
      ...(Platform.OS === 'web'
        ? ({
            borderColor: hexToRgbA(defaultTheme.black, 14),
          } as object)
        : {
            borderColor: defaultTheme.orange,
          }),
    },
    inputContainerError: {
      borderColor: '#ef4444',
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
      ...(Platform.OS === 'web'
        ? ({
            outlineStyle: 'none',
            outlineWidth: 0,
            outlineColor: 'transparent',
            boxShadow: 'none',
            appearance: 'none',
            WebkitAppearance: 'none',
          } as object)
        : null),
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
