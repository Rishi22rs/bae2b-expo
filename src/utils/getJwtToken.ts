import AsyncStorage from '@react-native-async-storage/async-storage';

export const getJwtToken = async () => {
  return await AsyncStorage.getItem('jwt-token');
};
