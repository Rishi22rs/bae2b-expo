import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
import {navigationRef} from '../config/app-navigation/navigation-ref';
import {navigationConstants} from '../constants/app-navigation';

const loginResetState = {
  index: 0,
  routes: [
    {
      name: navigationConstants.LOGIN_ROUTE,
      params: {
        screen: navigationConstants.LOGIN,
        params: {},
      },
    },
  ],
};

export const logout = async (navigation?: any) => {
  await AsyncStorage.clear();
  if (navigation?.reset) {
    navigation.reset(loginResetState);
  } else if (navigationRef.isReady()) {
    navigationRef.resetRoot(loginResetState);
  }

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.history.replaceState(
      window.history.state,
      '',
      `/${navigationConstants.LOGIN_ROUTE}`,
    );
  }
};
