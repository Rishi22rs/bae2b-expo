import { useState } from "react";
import {
  Platform,
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { createStyleSheet } from "./style";

interface TextInputComponentProps extends TextInputProps {
  viewStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  error?: string;
  errorStyle?: StyleProp<TextStyle>;
  isError?: boolean;
  required?: boolean;
}

export const TextInputComponent = ({
  viewStyle,
  inputStyle,
  inputContainerStyle,
  label,
  labelStyle,
  error,
  errorStyle,
  isError = false,
  required = false,
  onFocus,
  onBlur,
  ...props
}: TextInputComponentProps) => {
  const style = createStyleSheet();
  const [isFocused, setIsFocused] = useState(false);

  const hasError = Boolean(error) || isError;

  return (
    <View style={style.wrapper}>
      <View
        style={[
          style.inputCard,
          viewStyle,
          inputContainerStyle,
          isFocused && !hasError && style.inputFocused,
          hasError && style.inputError,
        ]}
      >
        {/* Label INSIDE */}
        {label && (
          <Text style={[style.label, labelStyle, hasError && style.labelError]}>
            {label}
            {required && <Text style={style.requiredMark}> *</Text>}
          </Text>
        )}

        <TextInput
          {...props}
          style={[
            style.input,
            Platform.OS === "web"
              ? ({
                  outlineStyle: "none",
                  outlineWidth: 0,
                  boxShadow: "none",
                  appearance: "none",
                } as object)
              : null,
            inputStyle,
          ]}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          placeholderTextColor="#b9b9b9"
          underlineColorAndroid="transparent"
        />
      </View>

      {!!error && <Text style={[style.errorText, errorStyle]}>{error}</Text>}
    </View>
  );
};
