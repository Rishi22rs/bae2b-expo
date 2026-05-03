import { StyleSheet } from "react-native";
import { defaultTheme } from "../../config/theme";

export const createStyleSheet = () => {
  return StyleSheet.create({
    modal: {
      justifyContent: "flex-end",
      margin: 0,
    },
    sheet: {
      backgroundColor: "#ffffff",
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 28,
    },
    handle: {
      width: 42,
      height: 4,
      borderRadius: 999,
      backgroundColor: "#d7d7dc",
      alignSelf: "center",
      marginBottom: 18,
    },
    title: {
      color: "#151515",
      fontSize: 24,
      lineHeight: 30,
      fontWeight: "600",
      textAlign: "center",
    },
    subtitle: {
      color: "#6a6a74",
      fontSize: 14,
      lineHeight: 21,
      fontWeight: "500",
      textAlign: "center",
      marginTop: 8,
    },
    content: {
      marginTop: 14,
    },
    primaryButton: {
      marginTop: 20,
      minHeight: 52,
      borderRadius: 26,
      backgroundColor: defaultTheme.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    primaryButtonText: {
      color: "#ffffff",
      fontSize: 16,
      lineHeight: 19,
      fontWeight: "600",
    },
    secondaryButton: {
      marginTop: 10,
      minHeight: 52,
      borderRadius: 26,
      backgroundColor: defaultTheme.primaryDisabled,
      alignItems: "center",
      justifyContent: "center",
    },
    secondaryButtonText: {
      color: defaultTheme.primary,
      fontSize: 16,
      lineHeight: 19,
      fontWeight: "600",
    },
  });
};
