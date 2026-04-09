import {Platform} from 'react-native';

type NavigationLike = {
  canGoBack?: () => boolean;
  goBack?: () => void;
  navigate?: (screen: string, params?: object) => void;
};

type BackFallback = {
  screen: string;
  params?: object;
};

export const goBackWithWebFallback = (
  navigation: NavigationLike,
  fallback?: BackFallback,
) => {
  if (navigation?.canGoBack?.()) {
    navigation.goBack?.();
    return;
  }

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
  }

  if (fallback?.screen) {
    navigation?.navigate?.(fallback.screen, fallback.params);
  }
};
