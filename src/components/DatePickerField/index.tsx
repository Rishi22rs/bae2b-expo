import DateTimePicker from "@react-native-community/datetimepicker";
import { defaultTheme } from "@/config/theme";
import React, { useMemo, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createStyleSheet } from "./style";

interface DatePickerFieldProps {
  label?: string;
  value?: Date | string | null;
  onChange?: (date: Date) => void;
  onBlur?: () => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  placeholder?: string;
  maximumDate?: Date;
  minimumDate?: Date;
  mode?: "date" | "time";
  containerStyle?: StyleProp<ViewStyle>;
  fieldStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  iconName?: string;
  iconColor?: string;
}

const WebDateInput = "input" as any;

const toValidDate = (value?: Date | string | null) => {
  if (!value) {
    return null;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();
    const yyyyMmDdMatch = trimmedValue.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (yyyyMmDdMatch) {
      const parsed = new Date(
        Number(yyyyMmDdMatch[1]),
        Number(yyyyMmDdMatch[2]) - 1,
        Number(yyyyMmDdMatch[3]),
      );

      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    const parsed = new Date(trimmedValue);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return null;
};

const toWebDateValue = (value?: Date | null) => {
  if (!value) {
    return "";
  }

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const toWebTimeValue = (value?: Date | null) => {
  if (!value) {
    return "";
  }

  const hours = String(value.getHours()).padStart(2, "0");
  const minutes = String(value.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const DatePickerField = ({
  label,
  value,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  error,
  placeholder = "Select date",
  maximumDate,
  minimumDate,
  mode = "date",
  containerStyle,
  fieldStyle,
  labelStyle,
  valueStyle,
  errorStyle,
  iconName = "calendar-outline",
  iconColor = defaultTheme.black,
}: DatePickerFieldProps) => {
  const style = createStyleSheet();
  const [isFocused, setIsFocused] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const webInputRef = useRef<any>(null);

  const hasError = Boolean(error);
  const selectedDate = useMemo(() => toValidDate(value), [value]);
  const displayValue =
    mode === "time"
      ? selectedDate
        ? selectedDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : ""
      : selectedDate
        ? selectedDate.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "";
  const webInputValue =
    mode === "time" ? toWebTimeValue(selectedDate) : toWebDateValue(selectedDate);
  const maxWebDate = toWebDateValue(maximumDate || null);
  const minWebDate = toWebDateValue(minimumDate || null);
  const webDateInputStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    opacity: 0,
    cursor: "pointer",
    outline: "none",
    appearance: "none",
    WebkitAppearance: "none",
    boxShadow: "none",
    backgroundColor: "transparent",
  } as const;
  const nativeDisplay =
    Platform.OS === "ios"
      ? mode === "time"
        ? "spinner"
        : "inline"
      : mode === "time"
        ? "clock"
        : "calendar";

  const onPressField = () => {
    if (disabled) {
      return;
    }

    if (Platform.OS === "web") {
      setIsFocused(true);
      const inputNode = webInputRef.current;

      if (typeof inputNode?.showPicker === "function") {
        inputNode.showPicker();
        return;
      }

      inputNode?.focus?.();
      inputNode?.click?.();
      return;
    }

    setShowDatePicker(true);
  };

  const handleNativeChange = (
    event: { type?: string },
    nextDate?: Date,
  ) => {
    if (event?.type === "dismissed") {
      setShowDatePicker(false);
      onBlur?.();
      return;
    }

    if (nextDate && !Number.isNaN(nextDate.getTime())) {
      onChange?.(nextDate);
    }

    if (Platform.OS === "android") {
      setShowDatePicker(false);
      onBlur?.();
    }
  };

  const handleWebInputChange = (event: any) => {
    const inputValue = event?.target?.value;
    if (!inputValue) {
      return;
    }

    if (mode === "time") {
      const [hours, minutes] = String(inputValue)
        .split(":")
        .map((part) => Number(part));
      const baseDate = selectedDate || new Date();
      const parsedTime = new Date(baseDate);
      parsedTime.setHours(hours, minutes, 0, 0);

      if (!Number.isNaN(parsedTime.getTime())) {
        onChange?.(parsedTime);
      }
      return;
    }

    const [year, month, day] = String(inputValue)
      .split("-")
      .map((part) => Number(part));
    const parsedDate = new Date(year, month - 1, day);

    if (!Number.isNaN(parsedDate.getTime())) {
      onChange?.(parsedDate);
    }
  };

  return (
    <View style={[style.wrapper, containerStyle]}>
      <Pressable
        onPress={onPressField}
        disabled={disabled}
        onPressIn={() => {
          if (Platform.OS !== "web") {
            setIsFocused(true);
          }
        }}
        onPressOut={() => {
          if (Platform.OS !== "web") {
            setIsFocused(false);
            onBlur?.();
          }
        }}
        style={[
          style.inputCard,
          disabled && style.inputDisabled,
          fieldStyle,
          isFocused && !hasError && style.inputFocused,
          hasError && style.inputError,
        ]}
      >
        {/* Label INSIDE (same as TextInputComponent) */}
        {label && (
          <Text style={[style.label, labelStyle, hasError && style.labelError]}>
            {label}
            {required && <Text style={style.requiredMark}> *</Text>}
          </Text>
        )}

        {/* Value (acts like input text) */}
        <View style={style.valueRow}>
          <Text
            numberOfLines={1}
            style={[style.inputText, !displayValue && style.placeholder, valueStyle]}
          >
            {displayValue || placeholder}
          </Text>

          <Ionicons name={iconName} size={18} color={iconColor} />
        </View>

        {Platform.OS === "web" ? (
          <WebDateInput
            ref={webInputRef}
            type={mode === "time" ? "time" : "date"}
            value={webInputValue}
            max={mode === "date" ? maxWebDate || undefined : undefined}
            min={mode === "date" ? minWebDate || undefined : undefined}
            onChange={handleWebInputChange}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              onBlur?.();
            }}
            aria-label={label || "Date input"}
            style={webDateInputStyle}
          />
        ) : null}
      </Pressable>

      {showDatePicker && Platform.OS !== "web" ? (
        <View style={style.nativePickerWrap}>
          <DateTimePicker
            mode={mode}
            value={selectedDate || new Date()}
            display={nativeDisplay as any}
            onChange={handleNativeChange}
            maximumDate={mode === "date" ? maximumDate : undefined}
            minimumDate={mode === "date" ? minimumDate : undefined}
          />
          {Platform.OS === "ios" ? (
            <Pressable
              onPress={() => {
                setShowDatePicker(false);
                onBlur?.();
              }}
              style={style.iosDoneButton}
            >
              <Text style={style.iosDoneButtonText}>Done</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {!!error && <Text style={[style.errorText, errorStyle]}>{error}</Text>}
    </View>
  );
};
