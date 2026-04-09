import {
  Pressable,
  PressableProps,
  StyleProp,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {createStyleSheet} from './style';
import {LinearGradient} from 'expo-linear-gradient';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

interface ButtonComponentProps extends PressableProps {
  viewStyle?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
  children?: React.ReactNode;
  buttonText: string;
  disabled?: boolean;
  icon?: any;
  showIcon?: boolean;
}

export const ButtonComponent = (props: ButtonComponentProps) => {
  const {
    children,
    viewStyle,
    textStyle,
    style: pressableStyle,
    buttonText = '',
    disabled = false,
    icon = <Icon name="log-out-outline" size={20} color="#fff" />,
    showIcon = false,
    ...pressableProps
  } = props;
  const style = createStyleSheet();

  return (
    <LinearGradient
      colors={
        disabled
          ? ['#d1d5db', '#cbd5e1']
          : ['#f96163', '#f74a6e']
      }
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={[style.logoutButton, disabled && style.logoutButtonDisabled, viewStyle]}>
      <Pressable
        {...pressableProps}
        disabled={disabled}
        style={[style.logoutContent, pressableStyle, disabled && style.logoutContentDisabled]}>
        {showIcon && icon}
        <Text
          style={[
            style.logoutText,
            style.text,
            textStyle,
            disabled && style.logoutTextDisabled,
          ]}>
          {buttonText}
        </Text>
      </Pressable>
    </LinearGradient>
  );
};
