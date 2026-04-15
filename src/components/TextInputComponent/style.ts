import { StyleSheet } from "react-native";

export const createStyleSheet = () => {
  return StyleSheet.create({
    wrapper: {
      width: "100%",
    },

    inputCard: {
      backgroundColor: "#f3f3f7", // same as phoneCard
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      justifyContent: "flex-start",
    },

    inputFocused: {
      backgroundColor: "#ececf2", // subtle focus like OTP
    },

    inputError: {
      borderWidth: 1,
      borderColor: "#ef4444",
    },

    label: {
      color: "#222222",
      fontSize: 12,
      lineHeight: 14,
      fontWeight: "500",
      marginBottom: 6,
    },

    labelError: {
      color: "#b91c1c",
    },

    requiredMark: {
      color: "#b91c1c",
    },

    input: {
      color: "#1f1f1f",
      fontSize: 32 / 1.5, // same as phoneInput
      lineHeight: 32 / 1.5,
      fontWeight: "500",
      height: 42 / 1.5,
      paddingVertical: 0,
      paddingHorizontal: 0,
      margin: 0,
      textAlignVertical: "center",
      includeFontPadding: false,
    },

    errorText: {
      marginTop: 4,
      color: "#b91c1c",
      fontSize: 12,
      lineHeight: 16,
      fontWeight: "500",
    },
  });
};
