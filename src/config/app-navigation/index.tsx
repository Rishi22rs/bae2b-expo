import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { navigationConstants } from "../../constants/app-navigation";
import { Stepper } from "../../screens/stepper/index";
import { navigationRef } from "./navigation-ref";
import { AuthenticationRoute } from "./authentication-route";
import { BottomTabs } from "./bottom-tabs";
import { MatchMRoute } from "./match-route";
import { ProfileRoute } from "./profile-route";

const MasterStack = createNativeStackNavigator();
const linking = {
  enabled: true,
  prefixes: [Linking.createURL("/")],
};

const withAuthGuard = (ScreenComponent: React.ComponentType<any>) => {
  const GuardedScreen = (props: any) => {
    const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

    useEffect(() => {
      let isMounted = true;

      const enforceAuth = async () => {
        const token = await AsyncStorage.getItem("jwt-token");

        if (!isMounted) {
          return;
        }

        if (token) {
          setIsAllowed(true);
          return;
        }

        props.navigation.reset({
          index: 0,
          routes: [
            {
              name: navigationConstants.LOGIN_ROUTE,
              params: {
                screen: navigationConstants.LOGIN,
                params: {},
              },
            },
          ],
        });

        if (Platform.OS === "web" && typeof window !== "undefined") {
          window.history.replaceState(
            window.history.state,
            "",
            `/${navigationConstants.LOGIN_ROUTE}`,
          );
        }

        setIsAllowed(false);
      };

      enforceAuth();

      return () => {
        isMounted = false;
      };
    }, [props.navigation]);

    if (!isAllowed) {
      return null;
    }

    return <ScreenComponent {...props} />;
  };

  return GuardedScreen;
};

const ProtectedBottomTabs = withAuthGuard(BottomTabs);
const ProtectedProfileRoute = withAuthGuard(ProfileRoute);
const ProtectedMatchRoute = withAuthGuard(MatchMRoute);

export const AppNavigation = () => {
  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <MasterStack.Navigator screenOptions={{ headerShown: false }}>
        <MasterStack.Screen
          name={navigationConstants.STEPPER_SCREEN}
          component={Stepper}
        />
        <MasterStack.Screen
          name={navigationConstants.LOGIN_ROUTE}
          component={AuthenticationRoute}
        />
        <MasterStack.Screen
          name={navigationConstants.BOTTOM_TABS}
          component={ProtectedBottomTabs}
        />
        <MasterStack.Screen
          name={navigationConstants.PROFILE_ROUTE}
          component={ProtectedProfileRoute}
        />
        <MasterStack.Screen
          name={navigationConstants.MATCH_ROUTE}
          component={ProtectedMatchRoute}
        />
      </MasterStack.Navigator>
    </NavigationContainer>
  );
};
