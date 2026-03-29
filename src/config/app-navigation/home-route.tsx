import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { navigationConstants } from "../../constants/app-navigation";
import { Home } from "../../screens/home/index";

const HomeStack = createNativeStackNavigator();

export const HomeRoute = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_bottom",
        gestureDirection: "vertical",
      }}
    >
      <HomeStack.Screen name={navigationConstants.HOME} component={Home} />
    </HomeStack.Navigator>
  );
};
