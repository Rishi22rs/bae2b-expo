import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { LogBox, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  useFonts,
} from "@expo-google-fonts/montserrat";
import { AppNavigation } from "./src/config/app-navigation/index";
import { ToastHost } from "./src/components/Toast";

const WEB_MAX_WIDTH = 480;
const APP_FONT_FAMILY = Platform.OS === "web" ? "Montserrat, sans-serif" : "Montserrat_400Regular";
const WEB_INPUT_RESET_STYLE =
  Platform.OS === "web"
    ? ({
        outlineStyle: "none",
        outlineWidth: 0,
        outlineColor: "transparent",
      } as object)
    : null;
let hasAppliedGlobalFont = false;

const toStyleArray = (style: any) => {
  if (!style) return [];
  return Array.isArray(style) ? style : [style];
};

const applyGlobalAppFont = () => {
  if (hasAppliedGlobalFont) {
    return;
  }

  const TextComponent = Text as unknown as { defaultProps?: Record<string, any> };
  const InputComponent = TextInput as unknown as { defaultProps?: Record<string, any> };

  const textDefaults = TextComponent.defaultProps || {};
  const textStyle = toStyleArray(textDefaults.style);
  TextComponent.defaultProps = {
    ...textDefaults,
    style: [{ fontFamily: APP_FONT_FAMILY }, ...textStyle],
  };

  const inputDefaults = InputComponent.defaultProps || {};
  const inputStyle = toStyleArray(inputDefaults.style);
  InputComponent.defaultProps = {
    ...inputDefaults,
    style: [{ fontFamily: APP_FONT_FAMILY }, WEB_INPUT_RESET_STYLE, ...inputStyle],
  };

  hasAppliedGlobalFont = true;
};

function App() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
  });

  if (__DEV__) {
    import("./src/reactotron-config");
    LogBox.ignoreAllLogs();
  }

  if (!fontsLoaded) {
    return null;
  }

  applyGlobalAppFont();

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#ffffff" translucent={false} />
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.root}>
          <View style={styles.appShell}>
            <AppNavigation />
            <ToastHost />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  root: {
    flex: 1,
    ...(Platform.OS === "web"
      ? {
          alignItems: "center",
          backgroundColor: "#f3f4f6",
        }
      : null),
  },
  appShell: {
    flex: 1,
    width: "100%",
    ...(Platform.OS === "web"
      ? {
          maxWidth: WEB_MAX_WIDTH,
        }
      : null),
  },
});

export default App;
