import * as Location from 'expo-location';
import {Platform} from 'react-native';
import {Linking} from 'react-native';

export const requestLocationPermission = async () => {
  try {
    if (
      Platform.OS === 'web' &&
      typeof window !== 'undefined' &&
      !window.isSecureContext
    ) {
      console.warn(
        'Location permission on web requires HTTPS or localhost. Current origin is not secure.',
      );
      return false;
    }

    const existingPermission = await Location.getForegroundPermissionsAsync();
    if (existingPermission.status === 'granted') {
      return true;
    }

    const requestedPermission = await Location.requestForegroundPermissionsAsync();
    if (requestedPermission.status === 'granted') {
      return true;
    }

    if (!requestedPermission.canAskAgain && Platform.OS !== 'web') {
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
