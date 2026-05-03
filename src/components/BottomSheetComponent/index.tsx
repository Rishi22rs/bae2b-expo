import React, {
  ReactNode,
  Ref,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { Pressable, Text, View } from "react-native";
import ReactNativeModal from "react-native-modal";
import { createStyleSheet } from "./style";

export type BottomSheetHandle = {
  open: () => void;
  close: () => void;
};

type BottomSheetProps = {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  primaryLabel?: string;
  onPrimaryPress?: () => void;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
};

const BottomSheetComponentBase = (
  {
    title,
    subtitle,
    children,
    primaryLabel = "Got it",
    onPrimaryPress,
    secondaryLabel,
    onSecondaryPress,
  }: BottomSheetProps,
  ref: Ref<BottomSheetHandle>,
) => {
  const styles = createStyleSheet();
  const [visible, setVisible] = useState(false);

  const close = () => setVisible(false);

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
    close,
  }));

  return (
    <ReactNativeModal
      isVisible={visible}
      onBackdropPress={close}
      onBackButtonPress={close}
      swipeDirection={["down"]}
      onSwipeComplete={close}
      style={styles.modal}
      useNativeDriverForBackdrop
      hideModalContentWhileAnimating
    >
      <View style={styles.sheet}>
        <View style={styles.handle} />

        {title ? <Text style={styles.title}>{title}</Text> : null}
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

        {children ? <View style={styles.content}>{children}</View> : null}

        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            onPrimaryPress?.();
            close();
          }}
        >
          <Text style={styles.primaryButtonText}>{primaryLabel}</Text>
        </Pressable>

        {secondaryLabel ? (
          <Pressable
            style={styles.secondaryButton}
            onPress={() => {
              onSecondaryPress?.();
              close();
            }}
          >
            <Text style={styles.secondaryButtonText}>{secondaryLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </ReactNativeModal>
  );
};

export const BottomSheetComponent = forwardRef(BottomSheetComponentBase);
