import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform } from "react-native";
import { useEffect, useState } from "react";
import { navigationConstants } from "../../constants/app-navigation";
import { Login } from "../../screens/login/index";
import { LoginScreen } from "../../screens/login/login-screen";
import { OtpScreen } from "../../screens/login/otp-screen";
import { Onboarding } from "../../screens/onboarding/index";

const AuthenticationStack = createNativeStackNavigator();

export const AuthenticationRoute = () => {
  const navigation = useNavigation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const guardAuthenticatedUsers = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt-token");

        if (!isMounted) {
          return;
        }

        if (token) {
          (navigation as any).reset({
            index: 0,
            routes: [{ name: navigationConstants.STEPPER_SCREEN }],
          });

          if (Platform.OS === "web" && typeof window !== "undefined") {
            window.history.replaceState(
              window.history.state,
              "",
              `/${navigationConstants.STEPPER_SCREEN}`,
            );
          }
          return;
        }
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    };

    guardAuthenticatedUsers();

    return () => {
      isMounted = false;
    };
  }, [navigation]);

  if (isCheckingAuth) {
    return null;
  }

  return (
    <AuthenticationStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthenticationStack.Screen
        name={navigationConstants.LOGIN}
        component={Login}
      />
      <AuthenticationStack.Screen
        name={navigationConstants.LOGIN_PAGE}
        component={LoginScreen}
      />
      <AuthenticationStack.Screen
        name={navigationConstants.OTP_PAGE}
        component={OtpScreen}
      />
      <AuthenticationStack.Screen
        name={navigationConstants.ONBOARDING}
        component={Onboarding}
      />
    </AuthenticationStack.Navigator>
  );
};
