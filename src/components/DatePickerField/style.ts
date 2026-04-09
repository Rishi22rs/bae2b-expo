import {StyleSheet} from 'react-native';
import {defaultTheme} from '../../config/theme';

export const createStyleSheet = () =>
  StyleSheet.create({
    container: {
      gap: 6,
    },
    label: {
      fontSize: 12,
      color: defaultTheme.mutedText,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    labelError: {
      color: '#b91c1c',
    },
    requiredMark: {
      color: '#ef4444',
      fontWeight: '700',
    },
    field: {
      position: 'relative',
      borderRadius: 14,
      borderWidth: 1,
      borderColor: defaultTheme.pinkBorder,
      backgroundColor: '#fff5f9',
      paddingHorizontal: 14,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      minHeight: 52,
    },
    fieldError: {
      borderColor: '#fca5a5',
      backgroundColor: '#fff1f2',
    },
    fieldDisabled: {
      opacity: 0.65,
    },
    value: {
      fontSize: 15,
      color: defaultTheme.darkText,
      fontWeight: '600',
      flex: 1,
    },
    errorText: {
      color: '#b91c1c',
      fontSize: 12,
      fontWeight: '600',
      lineHeight: 16,
    },
  });
