import React from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { TextComponent } from "../TextComponent";
import { createStyleSheet } from "./style";

interface ButtonComponentProps extends PressableProps {
  viewStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  buttonText: string;
  disabled?: boolean;
  icon?: any;
  showIcon?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

export const ButtonComponent = (props: ButtonComponentProps) => {
  const {
    children,
    viewStyle,
    textStyle,
    style: pressableStyle,
    buttonText = "",
    disabled = false,
    icon = <Icon name="log-out-outline" size={20} color="#1f1518" />,
    showIcon = false,
    isLoading = false,
    loadingText = "Loading...",
    ...pressableProps
  } = props;
  const style = createStyleSheet();
  console.log();
  return (
    <Pressable
      disabled={disabled}
      style={[
        style.authPrimaryButton,
        disabled ? style.authPrimaryButtonDisabled : null,
        viewStyle,
      ]}
      {...pressableProps}
    >
      <TextComponent
        viewStyle={
          !isLoading
            ? style.authPrimaryButtonText
            : {
                ...style.authPrimaryButtonText,
                ...style.authPrimaryButtonTextDisabled,
              }
        }
      >
        {isLoading ? loadingText : buttonText}
      </TextComponent>
    </Pressable>
  );
};
