import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { navigationConstants } from "../../constants/app-navigation";
import { Stepper } from "../../screens/stepper/index";
import { AuthenticationRoute } from "./authentication-route";
import { BottomTabs } from "./bottom-tabs";
import { MatchMRoute } from "./match-route";
import { ProfileRoute } from "./profile-route";

const MasterStack = createNativeStackNavigator();

export const AppNavigation = () => {
  return (
    <NavigationContainer>
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
          component={BottomTabs}
        />
        <MasterStack.Screen
          name={navigationConstants.PROFILE_ROUTE}
          component={ProfileRoute}
        />
        <MasterStack.Screen
          name={navigationConstants.MATCH_ROUTE}
          component={MatchMRoute}
        />
      </MasterStack.Navigator>
    </NavigationContainer>
  );
};
