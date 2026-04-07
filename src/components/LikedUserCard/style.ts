import {Platform, StyleSheet} from 'react-native';

export const createStyleSheet = () => {
  return StyleSheet.create({
    container: {
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 14,
      elevation: 5,
      ...(Platform.OS === 'web'
        ? ({
            transitionDuration: '160ms',
            transitionProperty: 'transform, box-shadow',
            transitionTimingFunction: 'ease',
          } as object)
        : null),
    },
    pressed: {
      transform: [{scale: 0.985}],
      opacity: 0.96,
    },
    surface: {
      borderRadius: 20,
      overflow: 'hidden',
      backgroundColor: '#121212',
    },
    mediaContainer: {
      height: 238,
      backgroundColor: '#EFEFEF',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    imageOverlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    infoOverlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 11,
      paddingBottom: 11,
      paddingTop: 24,
      gap: 7,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    name: {
      fontSize: 17,
      fontWeight: '700',
      color: '#ffffff',
      flex: 1,
    },
    age: {
      fontSize: 14,
      fontWeight: '700',
      color: 'rgba(255,255,255,0.92)',
    },
    footerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 2,
    },
    statusChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      borderRadius: 999,
      backgroundColor: 'rgba(255,255,255,0.18)',
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    statusText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#ffffff',
      letterSpacing: 0.3,
    },
    badge: {
      position: 'absolute',
      top: 10,
      left: 10,
      borderRadius: 100,
      backgroundColor: 'rgba(255,255,255,0.9)',
      paddingVertical: 5,
      paddingHorizontal: 9,
    },
    badgeText: {
      color: '#111827',
      fontWeight: '700',
      fontSize: 10,
      letterSpacing: 0.3,
      textTransform: 'uppercase',
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 1,
    },
    locationText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '600',
      flex: 1,
    },
  });
};
