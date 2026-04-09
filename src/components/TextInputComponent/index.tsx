import {
  Platform,
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {useState} from 'react';
import {createStyleSheet} from './style';
import SearchIcon from 'react-native-vector-icons/EvilIcons';

interface TextInputComponentProps extends TextInputProps {
  viewStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  iconName?: string;
  iconSize?: number;
  showIcon?: boolean;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  error?: string;
  errorStyle?: StyleProp<TextStyle>;
  numOfLines?: number;
  isError?: boolean;
  required?: boolean;
}

export const TextInputComponent = ({
  viewStyle,
  inputStyle,
  inputContainerStyle,
  iconName,
  iconSize = 24,
  showIcon = false,
  label,
  labelStyle,
  error,
  errorStyle,
  numOfLines = 1,
  isError = false,
  required = false,
  onFocus,
  onBlur,
  placeholderTextColor,
  multiline,
  ...props
}: TextInputComponentProps) => {
  const style = createStyleSheet();
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(error) || isError;
  const useMultiline = multiline || numOfLines > 1;

  return (
    <View style={style.fieldWrapper}>
      {label && (
        <Text style={[style.label, labelStyle, hasError && style.labelError]}>
          {label}
          {required && <Text style={style.requiredMark}> *</Text>}
        </Text>
      )}
      <View
        style={[
          style.inputContainer,
          viewStyle,
          inputContainerStyle,
          isFocused && !hasError && style.inputContainerFocused,
          hasError && style.inputContainerError,
        ]}>
        {showIcon && (
          <SearchIcon
            name={iconName || 'search'}
            size={iconSize}
            style={style.iconStyle}
          />
        )}
        <TextInput
          {...props}
          style={[
            style.textInput,
            useMultiline && style.textInputMultiline,
            inputStyle,
          ]}
          onFocus={event => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={event => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          placeholderTextColor={placeholderTextColor || '#9ca3af'}
          multiline={useMultiline}
          numberOfLines={useMultiline ? numOfLines : 1}
          textAlignVertical={useMultiline ? 'top' : 'center'}
          cursorColor={hasError ? '#ef4444' : undefined}
          selectionColor={hasError ? '#ef4444' : undefined}
          underlineColorAndroid="transparent"
        />
      </View>
      {!!error && (
        <Text
          style={[
            style.errorText,
            errorStyle,
          ]}
          accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}
    </View>
  );
};
