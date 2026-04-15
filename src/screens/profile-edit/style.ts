import { StyleSheet } from "react-native";
import { defaultTheme } from "../../config/theme";
import { hexToRgbA } from "../../utils/hexToRgba";

export const createStyleSheet = () => {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: "#ffffff",
    },
    keyboardLayout: {
      flex: 1,
      backgroundColor: "#ffffff",
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 8,
    },
    formSection: {
      gap: 14,
      marginBottom: 18,
    },
    photosHeader: {
      gap: 6,
    },
    photosTitle: {
      fontSize: 16,
      lineHeight: 20,
      color: defaultTheme.primary,
      fontWeight: "500",
    },
    photosSubtitle: {
      fontSize: 13,
      lineHeight: 18,
      color: hexToRgbA(defaultTheme.primary, 65),
      fontWeight: "500",
    },
    photoGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    photoCard: {
      width: "48%",
      aspectRatio: 1.08,
      borderRadius: 18,
      overflow: "hidden",
      backgroundColor: defaultTheme.primaryDisabled,
      borderWidth: 1,
      borderColor: defaultTheme.primaryDisabled,
      position: "relative",
    },
    photoCardFilled: {
      borderColor: defaultTheme.primary,
    },
    photoPreview: {
      width: "100%",
      height: "100%",
    },
    photoPlaceholder: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 12,
      gap: 8,
    },
    photoPlusIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: defaultTheme.white,
    },
    photoPlusIcon: {
      fontSize: 22,
      lineHeight: 24,
      color: defaultTheme.primary,
      fontWeight: "500",
    },
    photoPlaceholderTitle: {
      fontSize: 13,
      lineHeight: 16,
      color: defaultTheme.primary,
      fontWeight: "500",
      textAlign: "center",
    },
    photoPlaceholderText: {
      fontSize: 11,
      lineHeight: 14,
      color: hexToRgbA(defaultTheme.primary, 62),
      fontWeight: "500",
      textAlign: "center",
    },
    removePhotoButton: {
      position: "absolute",
      top: 10,
      right: 10,
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(17,17,17,0.72)",
    },
    removePhotoButtonText: {
      color: "#ffffff",
      fontSize: 16,
      lineHeight: 16,
      fontWeight: "500",
    },
    footer: {
      backgroundColor: "#ffffff",
    },
    updateButton: {
      width: "100%",
    },
  });
};
