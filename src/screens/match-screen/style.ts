import { StyleSheet } from "react-native";
import { defaultTheme } from "../../config/theme";
import { screenWidth } from "../../utils/dimensions";

export const createStyleSheet = () => {
  return StyleSheet.create({
    loaderContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#ffffff",
      paddingHorizontal: 24,
      gap: 12,
    },
    loaderAccent: {
      color: defaultTheme.primary,
    },
    loaderText: {
      color: defaultTheme.mutedText,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "500",
      textAlign: "center",
    },
    errorText: {
      color: "#b91c1c",
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "500",
      textAlign: "center",
    },
    retryButton: {
      borderRadius: 22,
      paddingHorizontal: 18,
      paddingVertical: 12,
      backgroundColor: defaultTheme.primary,
      marginTop: 4,
    },
    retryButtonText: {
      color: "#ffffff",
      fontSize: 14,
      fontWeight: "600",
    },
    container: {
      flex: 1,
      backgroundColor: "#ffffff",
      paddingHorizontal: 24,
      paddingBottom: 28,
    },
    content: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
    },
    badge: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: defaultTheme.primaryDisabled,
    },
    badgeText: {
      color: defaultTheme.primary,
      fontSize: 13,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    title: {
      color: "#171717",
      fontSize: 30,
      lineHeight: 34,
      fontWeight: "700",
      textAlign: "center",
    },
    subtitle: {
      color: defaultTheme.primary,
      fontSize: 15,
      lineHeight: 22,
      textAlign: "center",
      maxWidth: 320,
    },
    cardStack: {
      width: "100%",
      height: screenWidth * 0.78,
      maxHeight: 360,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
      marginBottom: 8,
    },
    profileCard: {
      position: "absolute",
      width: screenWidth * 0.48,
      maxWidth: 210,
      aspectRatio: 0.78,
      borderRadius: 28,
      backgroundColor: "#f5f5f5",
    },
    profileCardLeft: {
      left: 22,
      transform: [{ rotate: "-10deg" }],
    },
    profileCardRight: {
      right: 22,
      transform: [{ rotate: "10deg" }],
    },
    actions: {
      width: "100%",
      gap: 12,
      marginTop: 4,
    },
    primaryButton: {
      width: "100%",
      backgroundColor: defaultTheme.primary,
      marginBottom: 0,
    },
    secondaryButton: {
      width: "100%",
      minHeight: 50,
      borderRadius: 26,
      backgroundColor: defaultTheme.primaryDisabled,
      alignItems: "center",
      justifyContent: "center",
    },
    secondaryButtonText: {
      color: defaultTheme.primary,
      fontSize: 16,
      fontWeight: "600",
    },
    ghostButton: {
      width: "100%",
      minHeight: 50,
      borderRadius: 26,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "#eadde1",
      backgroundColor: "#ffffff",
    },
    ghostButtonDisabled: {
      opacity: 0.6,
    },
    ghostButtonText: {
      color: "#6b6470",
      fontSize: 15,
      fontWeight: "500",
    },
  });
};
