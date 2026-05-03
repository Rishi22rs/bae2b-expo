import { StyleSheet } from "react-native";
import { defaultTheme } from "../../config/theme";

export const createStyleSheet = () => {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: "#ffffff",
    },
    profileContent: {
      backgroundColor: "#ffffff",
      paddingHorizontal: 12,
      paddingTop: 6,
      paddingBottom: 36,
    },
    heroCard: {
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "#f3f3f7",
      position: "relative",
    },
    heroImage: {
      width: "100%",
      backgroundColor: "#f3f3f7",
    },
    imageProgressRow: {
      position: "absolute",
      top: 12,
      left: 12,
      right: 12,
      flexDirection: "row",
      gap: 6,
      zIndex: 3,
    },
    imageProgressBar: {
      flex: 1,
      height: 3,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.32)",
    },
    imageProgressBarActive: {
      backgroundColor: "rgba(255,255,255,0.95)",
    },
    imageTapOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 160,
      flexDirection: "row",
      zIndex: 2,
    },
    imageTapZone: {
      flex: 1,
    },
    heroOverlay: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 18,
      paddingTop: 92,
      paddingBottom: 24,
      zIndex: 4,
    },
    heroTextBlock: {
      gap: 4,
    },
    heroName: {
      color: "#ffffff",
      fontSize: 32,
      lineHeight: 38,
      fontWeight: "500",
    },
    heroMeta: {
      color: "rgba(255,255,255,0.82)",
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "500",
    },
    promptCard: {
      marginTop: 10,
      borderRadius: 8,
      backgroundColor: "#f3f3f7",
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    promptLabel: {
      color: "#6b6b74",
      fontSize: 12,
      lineHeight: 16,
      fontWeight: "500",
      marginBottom: 8,
      textTransform: "uppercase",
      letterSpacing: 0.4,
    },
    promptText: {
      color: "#171717",
      fontSize: 18,
      lineHeight: 26,
      fontWeight: "500",
    },
    bioCard: {
      marginTop: 10,
      borderRadius: 8,
      backgroundColor: "#f3f3f7",
      paddingHorizontal: 14,
      paddingVertical: 14,
      flexDirection: "row",
      gap: 12,
    },
    bioIconBubble: {
      width: 38,
      height: 38,
      borderRadius: 999,
      backgroundColor: "#ffffff",
      alignItems: "center",
      justifyContent: "center",
    },
    bioContent: {
      flex: 1,
    },
    bioLabel: {
      color: "#6b6b74",
      fontSize: 12,
      lineHeight: 16,
      fontWeight: "500",
      marginBottom: 4,
      textTransform: "uppercase",
      letterSpacing: 0.4,
    },
    bioText: {
      color: "#171717",
      fontSize: 16,
      lineHeight: 23,
      fontWeight: "400",
    },
    chipRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    chip: {
      borderRadius: 999,
      backgroundColor: "#ffffff",
      borderWidth: 1,
      borderColor: "#e4e4ea",
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    chipText: {
      color: defaultTheme.primary,
      fontSize: 13,
      lineHeight: 17,
      fontWeight: "500",
    },
  });
};
