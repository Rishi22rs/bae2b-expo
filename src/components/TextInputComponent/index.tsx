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
  textArea?: boolean;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  error?: string;
  errorStyle?: StyleProp<TextStyle>;
  isError?: boolean;
  required?: boolean;
  disabled?: boolean;
}

export const TextInputComponent = ({
  viewStyle,
  inputStyle,
  inputContainerStyle,
  textArea,
  label,
  labelStyle,
  error,
  errorStyle,
  isError = false,
  required = false,
  disabled = false,
  onFocus,
  onBlur,
  ...props
}: TextInputComponentProps) => {
  const style = createStyleSheet();
  const [isFocused, setIsFocused] = useState(false);

  const hasError = Boolean(error) || isError;
  const isTextArea = Boolean(textArea || props.multiline);

  return (
    <View style={style.wrapper}>
      <View
        style={[
          style.inputCard,
          isTextArea && style.textAreaCard,
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
          multiline={isTextArea}
          scrollEnabled={!isTextArea}
          style={[
            style.input,
            isTextArea && style.textAreaInput,
            disabled && style.inputDisabled,
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
          editable={!disabled}
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
