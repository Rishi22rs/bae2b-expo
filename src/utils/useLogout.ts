import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigationConstants} from '../constants/app-navigation';
import {useNavigation} from '@react-navigation/native';

export const logout = async (navigation: any) => {
  await AsyncStorage.clear();
  navigation.replace(navigationConstants.LOGIN_ROUTE, {
    name: navigationConstants.LOGIN,
  });
};
