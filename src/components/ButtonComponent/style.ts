import { Platform, StyleSheet } from "react-native";
import { defaultTheme } from "../../config/theme";
import { hexToRgbA } from "../../utils/hexToRgba";

export const createStyleSheet = () => {
  return StyleSheet.create({
    navigateButton: {
      paddingHorizontal: 62,
      paddingVertical: 18,
      backgroundColor: defaultTheme.brown,
      borderRadius: 16,
      alignItems: "center",
    },
    navigate: {
      fontSize: 16,
      fontWeight: 500,
      color: "white",
    },
    text: {
      fontSize: 15,
      fontWeight: "500",
      color: "#1f1518",
    },
    logoutButton: {
      marginTop: 16,
      minHeight: 52,
      borderRadius: 16,
      paddingHorizontal: 14,
      justifyContent: "center",
      borderWidth: 1,
      borderColor: hexToRgbA(defaultTheme.pinkText, 0.2),
    },
    logoutButtonDisabled: {
      opacity: 0.9,
    },
    logoutContent: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      minHeight: 22,
    },
    logoutContentDisabled: {
      opacity: 0.82,
    },
    logoutContentPressed: {
      opacity: 0.84,
    },
    logoutText: {
      color: "#1f1518",
      fontSize: 16,
      fontWeight: "500",
    },
    logoutTextDisabled: {
      color: "#6b6470",
    },
    authPrimaryButton: {
      width: "100%",
      minHeight: 50,
      borderRadius: 26,
      backgroundColor: "#1d1d1d",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
      ...(Platform.OS === "web" ? ({ cursor: "pointer" } as object) : null),
    },
    authPrimaryButtonDisabled: {
      backgroundColor: "#dedede",
    },
    authPrimaryButtonText: {
      color: "#ffffff",
      fontSize: 16,
      lineHeight: 19,
      fontWeight: "500",
    },
    authPrimaryButtonTextDisabled: {
      color: "#9a9a9f",
    },
  });
};
