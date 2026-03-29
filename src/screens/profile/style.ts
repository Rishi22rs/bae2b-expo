import {StyleSheet} from 'react-native';

export const createStyleSheet = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    title: {
      textAlign: 'center',
      marginTop: 16,
      fontSize: 18,
      fontWeight: '600',
      color: '#000',
    },
    profileSection: {
      alignItems: 'center',
      marginVertical: 20,
    },
    avatarContainer: {
      position: 'relative',
    },
    avatar: {
      height: 80,
      width: 80,
      borderRadius: 40,
    },
    editIcon: {
      position: 'absolute',
      bottom: 0,
      right: -4,
      backgroundColor: '#f74a6e',
      borderRadius: 12,
      padding: 4,
    },
    name: {
      marginTop: 10,
      fontSize: 18,
      fontWeight: '700',
      color: '#000',
    },
    email: {
      color: '#999',
      fontSize: 14,
    },
    optionsContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    optionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 14,
      borderBottomWidth: 0.5,
      borderColor: '#ccc',
    },
    optionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    optionLabel: {
      fontSize: 16,
      color: '#000',
    },
    logoutButton: {
      marginHorizontal: 20,
      marginTop: 20,
      padding: 14,
      borderRadius: 12,
    },
    logoutContent: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
    },
    logoutText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });
};
