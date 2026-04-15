import { Onboarding } from "@/screens/onboarding";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { navigationConstants } from "../../constants/app-navigation";

const OnboardingStack = createNativeStackNavigator();

export const OnboardingRoute = () => {
  return (
    <OnboardingStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <OnboardingStack.Screen
        name={navigationConstants.ONBOARDING}
        component={Onboarding}
      />
    </OnboardingStack.Navigator>
  );
};
