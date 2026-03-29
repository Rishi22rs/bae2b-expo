import {
  Pressable,
  PressableProps,
  StyleProp,
  Text,
  TextStyle,
} from 'react-native';
import {defaultTheme} from '../../config/theme';
import {hexToRgbA} from '../../utils/hexToRgba';
import {createStyleSheet} from './style';
import {LinearGradient} from 'expo-linear-gradient';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

interface ButtonComponentProps extends PressableProps {
  viewStyle?: StyleProp<PressableProps>;
  textStyle?: TextStyle;
  children?: React.ReactNode;
  buttonText: String;
  disabled?: boolean;
  icon?: any;
  showIcon?: boolean;
}

export const ButtonComponent = (props: ButtonComponentProps) => {
  const {
    children,
    viewStyle,
    textStyle,
    buttonText = '',
    disabled = false,
    icon = <Icon name="log-out-outline" size={20} color="#fff" />,
    showIcon = false,
  } = props;
  const style = createStyleSheet();
  return (
    // <Pressable
    //   {...props}
    //   style={[
    //     style.navigateButton,
    //     disabled
    //       ? {
    //           backgroundColor: hexToRgbA(defaultTheme.brown, 20),
    //         }
    //       : {},
    //     viewStyle,
    //   ]}>
    //   <Text style={[style.text, textStyle]}>{buttonText}</Text>
    // </Pressable>
    <LinearGradient
      colors={['#f96163', '#f74a6e']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={[style.logoutButton, viewStyle]}>
      <Pressable {...props} style={style.logoutContent}>
        {showIcon && icon}
        <Text style={[style.logoutText, style.text, textStyle]}>
          {buttonText}
        </Text>
      </Pressable>
    </LinearGradient>
  );
};
