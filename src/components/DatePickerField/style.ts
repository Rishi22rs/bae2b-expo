import { StyleSheet } from "react-native";

export const createStyleSheet = () => {
  return StyleSheet.create({
    wrapper: {
      width: "100%",
    },

    inputCard: {
      backgroundColor: "#f3f3f7",
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      justifyContent: "flex-start",
    },

    inputFocused: {
      backgroundColor: "#ececf2",
    },

    inputDisabled: {
      opacity: 0.72,
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

    valueRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    inputText: {
      color: "#1f1f1f",
      fontSize: 32 / 1.5,
      lineHeight: 32 / 1.5,
      fontWeight: "500",
      flex: 1,
      height: 42 / 1.5,
    },

    placeholder: {
      color: "#b9b9b9",
    },

    errorText: {
      marginTop: 4,
      color: "#b91c1c",
      fontSize: 12,
      lineHeight: 16,
      fontWeight: "500",
    },

    webDateInput: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100%",
      height: "100%",
      opacity: 0,
    },

    nativePickerWrap: {
      marginTop: 8,
      borderRadius: 14,
      overflow: "hidden",
      backgroundColor: "#f3f3f7",
    },

    iosDoneButton: {
      alignSelf: "flex-end",
      margin: 10,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: "#1d1d1d",
    },

    iosDoneButtonText: {
      color: "#ffffff",
      fontSize: 13,
      fontWeight: "500",
      lineHeight: 16,
    },
  });
};
