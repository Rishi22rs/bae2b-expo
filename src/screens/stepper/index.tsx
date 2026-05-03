import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useCurrentStep } from "../../api/auth";
import { navigationConstants } from "../../constants/app-navigation";
import { defaultTheme } from "../../config/theme";

export const Stepper = () => {
  const navigation = useNavigation<any>();
  const hasResolvedStepRef = useRef(false);
  const [message, setMessage] = useState("Checking your session...");

  const resetToRoute = (routeName: string, screen?: string) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: routeName,
            params: screen
              ? {
                  screen,
                  params: {},
                }
              : undefined,
          },
        ],
      }),
    );
  };

  useEffect(() => {
    if (hasResolvedStepRef.current) {
      return;
    }

    hasResolvedStepRef.current = true;

    let isMounted = true;

    const resolveStep = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt-token");

        if (!isMounted) {
          return;
        }

        if (!token) {
          resetToRoute(navigationConstants.LOGIN_ROUTE, navigationConstants.LOGIN);
          return;
        }

        setMessage("Opening your app...");

        const res = await useCurrentStep();

        if (!isMounted) {
          return;
        }

        const routeName = res?.data?.routeName;
        const route = res?.data?.route;

        const isAuthRoute =
          routeName === navigationConstants.LOGIN_ROUTE ||
          routeName === navigationConstants.LOGIN ||
          routeName === navigationConstants.LOGIN_PAGE ||
          routeName === navigationConstants.OTP ||
          routeName === navigationConstants.OTP_PAGE;

        if (
          !routeName ||
          routeName === navigationConstants.STEPPER_SCREEN ||
          isAuthRoute
        ) {
          resetToRoute(
            navigationConstants.BOTTOM_TABS,
            navigationConstants.HOME,
          );
          return;
        }

        resetToRoute(routeName, route);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const token = await AsyncStorage.getItem("jwt-token");

        if (token) {
          resetToRoute(navigationConstants.BOTTOM_TABS, navigationConstants.HOME);
          return;
        }

        resetToRoute(navigationConstants.LOGIN_ROUTE, navigationConstants.LOGIN);
      }
    };

    resolveStep();

    return () => {
      isMounted = false;
    };
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        gap: 12,
        paddingHorizontal: 24,
      }}
    >
      <ActivityIndicator size="large" color={defaultTheme.primary} />
      <Text style={{ color: defaultTheme.mutedText, fontSize: 14 }}>
        {message}
      </Text>
    </View>
  );
};
