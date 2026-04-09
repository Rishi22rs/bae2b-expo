import {Platform, StyleSheet} from 'react-native';
import {defaultTheme} from '../../config/theme';

export const createStyleSheet = (screenWidth: number) => {
  const isCompact = screenWidth < 360;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    contentContainer: {
      paddingHorizontal: isCompact ? 10 : 14,
      paddingTop: Platform.OS === 'web' ? 8 : 10,
      ...(Platform.OS !== 'web'
        ? ({
            flexGrow: 1,
            justifyContent: 'center',
          } as object)
        : null),
    },
    heroCard: {
      width: '100%',
      maxWidth: 420,
      alignSelf: 'center',
      backgroundColor: '#ffffff',
      borderRadius: 24,
      paddingHorizontal: isCompact ? 14 : 18,
      paddingTop: isCompact ? 16 : 20,
      paddingBottom: isCompact ? 14 : 18,
      borderWidth: 1,
      borderColor: '#fbe3ea',
      shadowColor: '#64163a',
      shadowOffset: {width: 0, height: 14},
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 5,
      ...(Platform.OS === 'web'
        ? ({
            boxShadow: '0px 16px 35px rgba(100,22,58,0.12)',
          } as object)
        : null),
    },
    heroTagRow: {
      alignItems: 'center',
      marginBottom: 12,
    },
    heroTag: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      borderRadius: 999,
      paddingVertical: 7,
      paddingHorizontal: 12,
      backgroundColor: '#fff2f7',
      borderWidth: 1,
      borderColor: '#f8d7e2',
    },
    heroTagText: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.6,
      color: defaultTheme.pinkText,
    },
    avatarStage: {
      position: 'relative',
      width: '100%',
      minHeight: isCompact ? 180 : 214,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      paddingVertical: 6,
      overflow: 'visible',
    },
    avatarPair: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: isCompact ? 8 : 12,
    },
    avatarShell: {
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: '#ffffff',
      backgroundColor: '#f8d9e4',
      shadowColor: '#000000',
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.17,
      shadowRadius: 18,
      elevation: 5,
    },
    avatarLeft: {
      transform: [{rotate: '-7deg'}, {translateY: 4}],
    },
    avatarRight: {
      transform: [{rotate: '7deg'}, {translateY: 4}],
    },
    avatarImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    avatarOverlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
    },
    heartBadge: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      marginLeft: -22,
      marginTop: -22,
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: defaultTheme.pinkPrimary,
      borderWidth: 2.5,
      borderColor: '#ffffff',
      zIndex: 8,
      shadowColor: '#000000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 5,
    },
    nameChip: {
      position: 'absolute',
      left: 10,
      right: 10,
      bottom: 10,
      borderRadius: 999,
      paddingVertical: 6,
      paddingHorizontal: 10,
      backgroundColor: 'rgba(0,0,0,0.45)',
      alignItems: 'center',
    },
    nameChipText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '700',
    },
    subtitle: {
      textAlign: 'center',
      color: defaultTheme.mutedText,
      fontSize: isCompact ? 14 : 15,
      fontWeight: '600',
      marginTop: 2,
    },
    title: {
      textAlign: 'center',
      color: defaultTheme.pinkText,
      fontSize: isCompact ? 26 : 31,
      lineHeight: isCompact ? 32 : 36,
      fontWeight: '700',
      marginTop: 3,
    },
    description: {
      textAlign: 'center',
      color: defaultTheme.darkText,
      fontSize: 14,
      lineHeight: 21,
      marginTop: 8,
      paddingHorizontal: 8,
    },
    actionContainer: {
      marginTop: isCompact ? 14 : 16,
      gap: 10,
    },
    primaryButtonGradient: {
      borderRadius: 14,
      overflow: 'hidden',
      ...(Platform.OS === 'web'
        ? ({
            transitionDuration: '180ms',
            transitionProperty: 'transform, box-shadow',
            transitionTimingFunction: 'ease',
            boxShadow: '0px 10px 24px rgba(247,74,110,0.32)',
          } as object)
        : null),
    },
    primaryButton: {
      minHeight: 52,
      alignItems: 'center',
      justifyContent: 'center',
      ...(Platform.OS === 'web' ? ({cursor: 'pointer'} as object) : null),
    },
    primaryButtonPressed: {
      opacity: 0.92,
    },
    primaryButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '700',
    },
    secondaryButton: {
      minHeight: 52,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: '#f8d6e0',
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
      ...(Platform.OS === 'web' ? ({cursor: 'pointer'} as object) : null),
    },
    secondaryButtonPressed: {
      backgroundColor: defaultTheme.pinkSurface,
    },
    secondaryButtonText: {
      color: defaultTheme.pinkText,
      fontSize: 15,
      fontWeight: '700',
    },
    unmatchButton: {
      minHeight: 42,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff5f8',
      ...(Platform.OS === 'web' ? ({cursor: 'pointer'} as object) : null),
    },
    unmatchButtonPressed: {
      backgroundColor: '#ffe9f1',
    },
    unmatchButtonDisabled: {
      opacity: 0.72,
    },
    unmatchButtonText: {
      color: defaultTheme.pinkText,
      fontSize: 14,
      fontWeight: '700',
    },
    footerNote: {
      marginTop: 3,
      textAlign: 'center',
      color: defaultTheme.mutedText,
      fontSize: 12,
      lineHeight: 17,
      paddingHorizontal: 8,
    },
  });
};
