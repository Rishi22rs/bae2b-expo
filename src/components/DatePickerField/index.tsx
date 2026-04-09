import React from 'react';
import {
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createStyleSheet} from './style';

interface DatePickerFieldProps {
  label?: string;
  value: string;
  onPress?: () => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  fieldStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  iconName?: string;
  iconColor?: string;
  children?: React.ReactNode;
}

export const DatePickerField = ({
  label = 'Date',
  value,
  onPress,
  disabled = false,
  required = false,
  error,
  containerStyle,
  fieldStyle,
  labelStyle,
  valueStyle,
  errorStyle,
  iconName = 'calendar-outline',
  iconColor = '#a12457',
  children,
}: DatePickerFieldProps) => {
  const styles = createStyleSheet();
  const hasError = Boolean(error);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle, hasError && styles.labelError]}>
        {label}
        {required ? <Text style={styles.requiredMark}> *</Text> : null}
      </Text>

      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={[
          styles.field,
          fieldStyle,
          hasError && styles.fieldError,
          disabled && styles.fieldDisabled,
        ]}>
        <Text numberOfLines={1} style={[styles.value, valueStyle]}>
          {value}
        </Text>
        <Ionicons name={iconName} size={18} color={iconColor} />
        {children}
      </Pressable>

      {hasError ? <Text style={[styles.errorText, errorStyle]}>{error}</Text> : null}
    </View>
  );
};
