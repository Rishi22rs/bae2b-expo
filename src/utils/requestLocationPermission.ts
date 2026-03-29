import * as Location from 'expo-location';
import {Linking} from 'react-native';

export const requestLocationPermission = async () => {
  try {
    const existingPermission = await Location.getForegroundPermissionsAsync();
    if (existingPermission.status === 'granted') {
      return true;
    }

    const requestedPermission = await Location.requestForegroundPermissionsAsync();
    if (requestedPermission.status === 'granted') {
      return true;
    }

    if (!requestedPermission.canAskAgain) {
      await Linking.openSettings().catch(() =>
        console.warn('Cannot open settings'),
      );
    }

    return false;
  } catch (err) {
    console.warn(err);
    return false;
  }
};
