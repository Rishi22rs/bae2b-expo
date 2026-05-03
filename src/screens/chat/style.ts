import { Platform, StyleSheet } from "react-native";
import { defaultTheme } from "../../config/theme";
import { hexToRgbA } from "../../utils/hexToRgba";

export const createStyleSheet = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#ffffff",
    },
    topBanner: {
      marginHorizontal: 16,
      marginTop: 4,
      marginBottom: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 16,
      backgroundColor: defaultTheme.primaryDisabled,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    topBannerDot: {
      width: 8,
      height: 8,
      borderRadius: 999,
      backgroundColor: defaultTheme.pinkSecondary,
    },
    topBannerText: {
      flex: 1,
      color: hexToRgbA(defaultTheme.primary, 72),
      fontSize: 13,
      lineHeight: 18,
      fontWeight: "500",
    },
    messagesContainer: {
      paddingHorizontal: 16,
      paddingBottom: 18,
      gap: 10,
    },
    messagesContainerEmpty: {
      flexGrow: 1,
      justifyContent: "center",
    },
    messageRow: {
      width: "100%",
    },
    messageRowMe: {
      alignItems: "flex-end",
    },
    messageRowOther: {
      alignItems: "flex-start",
    },
    messageBubble: {
      maxWidth: "82%",
      borderRadius: 22,
      paddingHorizontal: 14,
      paddingTop: 12,
      paddingBottom: 10,
    },
    myMessage: {
      backgroundColor: defaultTheme.pinkPrimary,
      borderBottomRightRadius: 8,
    },
    theirMessage: {
      backgroundColor: defaultTheme.primaryDisabled,
      borderBottomLeftRadius: 8,
    },
    messageText: {
      fontSize: 15,
      lineHeight: 21,
      fontWeight: "500",
    },
    myMessageText: {
      color: defaultTheme.darkText,
    },
    theirMessageText: {
      color: "#171717",
    },
    timeText: {
      marginTop: 6,
      fontSize: 11,
      lineHeight: 14,
      textAlign: "right",
      fontWeight: "500",
    },
    myTimeText: {
      color: hexToRgbA(defaultTheme.darkText, 60),
    },
    theirTimeText: {
      color: hexToRgbA(defaultTheme.primary, 50),
    },
    stateWrap: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 28,
      paddingVertical: 28,
    },
    stateBadge: {
      width: 54,
      height: 54,
      borderRadius: 18,
      backgroundColor: defaultTheme.primaryDisabled,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 14,
    },
    stateTitle: {
      color: "#171717",
      fontSize: 18,
      lineHeight: 24,
      fontWeight: "600",
      textAlign: "center",
    },
    stateSubtitle: {
      marginTop: 6,
      color: defaultTheme.mutedText,
      fontSize: 14,
      lineHeight: 21,
      textAlign: "center",
      maxWidth: 260,
    },
    composerShell: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: Platform.OS === "ios" ? 16 : 14,
      backgroundColor: "#ffffff",
    },
    composerCard: {
      minHeight: 62,
      borderRadius: 24,
      backgroundColor: defaultTheme.primaryDisabled,
      paddingLeft: 16,
      paddingRight: 10,
      paddingTop: 10,
      paddingBottom: 10,
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 10,
    },
    input: {
      flex: 1,
      maxHeight: 120,
      color: "#171717",
      fontSize: 15,
      lineHeight: 21,
      fontWeight: "500",
      ...(Platform.OS === "web"
        ? ({
            outlineStyle: "none",
            outlineWidth: 0,
            boxShadow: "none",
            appearance: "none",
          } as object)
        : null),
    },
    sendButton: {
      width: 42,
      height: 42,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: defaultTheme.primary,
      ...(Platform.OS === "web" ? ({ cursor: "pointer" } as object) : null),
    },
    sendButtonDisabled: {
      backgroundColor: "#e1e1e8",
    },
  });
};
