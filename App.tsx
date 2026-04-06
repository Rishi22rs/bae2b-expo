import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { LogBox, Platform, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AppNavigation } from "./src/config/app-navigation/index";

const WEB_MAX_WIDTH = 480;

function App() {
  if (__DEV__) {
    import("./src/reactotron-config");
    LogBox.ignoreAllLogs();
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#ffffff" translucent={false} />
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.root}>
          <View style={styles.appShell}>
            <AppNavigation />
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
