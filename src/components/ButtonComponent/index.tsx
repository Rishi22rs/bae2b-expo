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
import {defaultTheme} from '../../config/theme';

interface ButtonComponentProps extends PressableProps {
  viewStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
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
    icon = <Icon name="log-out-outline" size={20} color="#1f1518" />,
    showIcon = false,
    ...pressableProps
  } = props;
  const style = createStyleSheet();

  return (
    <LinearGradient
      colors={
        disabled
          ? ['#f3dce3', '#f3dce3']
          : [defaultTheme.pinkPrimary, defaultTheme.pinkPrimary]
      }
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={[style.logoutButton, disabled && style.logoutButtonDisabled, viewStyle]}>
      <Pressable
        {...pressableProps}
        disabled={disabled}
        style={({pressed}) => {
          const incomingStyle =
            typeof pressableStyle === 'function'
              ? pressableStyle({pressed})
              : pressableStyle;

          return [
            style.logoutContent,
            incomingStyle,
            disabled && style.logoutContentDisabled,
            pressed && !disabled && style.logoutContentPressed,
          ];
        }}>
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
