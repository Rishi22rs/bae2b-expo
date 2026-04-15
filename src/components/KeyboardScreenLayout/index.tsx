import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  EmitterSubscription,
  Keyboard,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createStyleSheet } from "./style";

interface KeyboardScreenLayoutProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  keyboardVerticalOffset?: number;
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollContentContainerStyle?: StyleProp<ViewStyle>;
  footerContainerStyle?: StyleProp<ViewStyle>;
}

export const KeyboardScreenLayout = ({
  children,
  footer,
  keyboardVerticalOffset,
  containerStyle,
  contentContainerStyle,
  scrollContentContainerStyle,
  footerContainerStyle,
}: KeyboardScreenLayoutProps) => {
  const styles = createStyleSheet();
  const insets = useSafeAreaInsets();
  const [footerHeight, setFooterHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const footerOffset = useRef(new Animated.Value(0)).current;
  const rootRef = useRef<View>(null);
  const footerBottomPadding = isKeyboardVisible ? 12 : Math.max(insets.bottom, 16);

  useEffect(() => {
    if (Platform.OS === "web") {
      return;
    }

    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const animateFooter = (toValue: number, duration?: number) => {
      Animated.timing(footerOffset, {
        toValue,
        duration: duration ?? (Platform.OS === "ios" ? 250 : 180),
        useNativeDriver: true,
      }).start();
    };

    const onKeyboardShow = (event: any) => {
      setIsKeyboardVisible(true);

      rootRef.current?.measureInWindow((_x, y, _width, height) => {
        const keyboardTop =
          event?.endCoordinates?.screenY ??
          Dimensions.get("window").height - (event?.endCoordinates?.height || 0);
        const overlap = Math.max(0, y + height - keyboardTop);

        animateFooter(-overlap, event?.duration);
      });
    };

    const onKeyboardHide = (event: any) => {
      setIsKeyboardVisible(false);
      animateFooter(0, event?.duration);
    };

    const subscriptions: EmitterSubscription[] = [
      Keyboard.addListener(showEvent, onKeyboardShow),
      Keyboard.addListener(hideEvent, onKeyboardHide),
    ];

    return () => {
      subscriptions.forEach((subscription) => subscription.remove());
    };
  }, [footerOffset, keyboardVerticalOffset]);

  const handleFooterLayout = (event: LayoutChangeEvent) => {
    const nextHeight = event.nativeEvent.layout.height;
    if (nextHeight !== footerHeight) {
      setFooterHeight(nextHeight);
    }
  };

  return (
    <View ref={rootRef} style={[styles.root, containerStyle]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          footer
            ? {
                paddingBottom: footerHeight + 12,
              }
            : null,
          footer ? styles.scrollContentWithFooter : null,
          scrollContentContainerStyle,
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={[styles.content, contentContainerStyle]}>{children}</View>
      </ScrollView>

      {footer ? (
        <Animated.View
          onLayout={handleFooterLayout}
          style={[
            styles.footer,
            { paddingBottom: footerBottomPadding },
            { transform: [{ translateY: footerOffset }] },
            footerContainerStyle,
          ]}
        >
          {footer}
        </Animated.View>
      ) : null}
    </View>
  );
};
