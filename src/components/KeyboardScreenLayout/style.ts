import { StyleSheet } from "react-native";

export const createStyleSheet = () => {
  return StyleSheet.create({
    root: {
      flex: 1,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    scrollContentWithFooter: {
      paddingBottom: 20,
    },
    content: {
      flexGrow: 1,
    },
    footer: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      paddingTop: 10,
      paddingHorizontal: 16,
      backgroundColor: "#ffffff",
    },
  });
};
