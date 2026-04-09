import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {TextComponent} from '../TextComponent';
import {setToastHandler, ToastPayload, ToastType} from '../../utils/toast';

type ToastHostProps = {
  defaultDuration?: number;
};

const ENTER_OFFSET = 18;
const EXIT_OFFSET = 12;

const getToastColors = (type: ToastType) => {
  if (type === 'success') {
    return {
      backgroundColor: '#1f9d55',
      borderColor: '#167f43',
      titleColor: '#ffffff',
      messageColor: '#ffffff',
    };
  }

  if (type === 'error') {
    return {
      backgroundColor: '#d64545',
      borderColor: '#b83232',
      titleColor: '#ffffff',
      messageColor: '#ffffff',
    };
  }

  return {
    backgroundColor: '#2d2d33',
    borderColor: '#1f1f23',
    titleColor: '#ffffff',
    messageColor: '#f4f4f5',
  };
};

export const ToastHost = ({defaultDuration = 2600}: ToastHostProps) => {
  const [queue, setQueue] = useState<ToastPayload[]>([]);
  const [activeToast, setActiveToast] = useState<ToastPayload | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-ENTER_OFFSET)).current;
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearDismissTimer = useCallback(() => {
    if (!dismissTimerRef.current) {
      return;
    }

    clearTimeout(dismissTimerRef.current);
    dismissTimerRef.current = null;
  }, []);

  const dismissToast = useCallback(() => {
    if (!activeToast) {
      return;
    }

    clearDismissTimer();
    const isBottom = activeToast.position === 'bottom';
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: isBottom ? EXIT_OFFSET : -EXIT_OFFSET,
        duration: 180,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActiveToast(null);
    });
  }, [activeToast, clearDismissTimer, opacity, translateY]);

  useEffect(() => {
    setToastHandler((payload: ToastPayload) => {
      const nextToast: ToastPayload = {
        type: 'info',
        position: 'top',
        duration: defaultDuration,
        ...payload,
      };

      setQueue(prev => [...prev, nextToast]);
    });

    return () => {
      setToastHandler(null);
    };
  }, [defaultDuration]);

  useEffect(() => {
    if (activeToast || queue.length === 0) {
      return;
    }

    setActiveToast(queue[0]);
    setQueue(prev => prev.slice(1));
  }, [activeToast, queue]);

  useEffect(() => {
    if (!activeToast) {
      return;
    }

    const isBottom = activeToast.position === 'bottom';
    translateY.setValue(isBottom ? ENTER_OFFSET : -ENTER_OFFSET);
    opacity.setValue(0);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    dismissTimerRef.current = setTimeout(
      dismissToast,
      activeToast.duration ?? defaultDuration,
    );

    return () => {
      clearDismissTimer();
    };
  }, [
    activeToast,
    clearDismissTimer,
    defaultDuration,
    dismissToast,
    opacity,
    translateY,
  ]);

  const variantColors = useMemo(
    () => getToastColors((activeToast?.type || 'info') as ToastType),
    [activeToast],
  );

  if (!activeToast) {
    return null;
  }

  const isBottom = activeToast.position === 'bottom';

  return (
    <View pointerEvents="box-none" style={styles.overlay}>
      <Animated.View
        style={[
          styles.anchor,
          isBottom ? styles.bottomAnchor : styles.topAnchor,
          {opacity, transform: [{translateY}]},
        ]}>
        <Pressable
          onPress={dismissToast}
          style={[
            styles.toastCard,
            {
              backgroundColor: variantColors.backgroundColor,
              borderColor: variantColors.borderColor,
            },
          ]}>
          {activeToast.title ? (
            <TextComponent
              viewStyle={[styles.titleText, {color: variantColors.titleColor}]}>
              {activeToast.title}
            </TextComponent>
          ) : null}
          <TextComponent
            viewStyle={[styles.messageText, {color: variantColors.messageColor}]}>
            {activeToast.message}
          </TextComponent>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
    pointerEvents: 'box-none',
  },
  anchor: {
    position: 'absolute',
    left: 12,
    right: 12,
    alignItems: 'center',
  },
  topAnchor: {
    top: Platform.OS === 'web' ? 14 : 10,
  },
  bottomAnchor: {
    bottom: Platform.OS === 'web' ? 16 : 14,
  },
  toastCard: {
    width: '100%',
    maxWidth: 460,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  titleText: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '500',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '400',
  },
});
