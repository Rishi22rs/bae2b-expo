import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { defaultTheme } from "../theme";
import { navigationConstants } from "../../constants/app-navigation";
import { LikesRoute } from "./likes-route";
import { Profile } from "../../screens/profile/index";
import { HomeRoute } from "./home-route";

const Tab = createBottomTabNavigator();

export const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: defaultTheme.primary,
        tabBarInactiveTintColor: "#9b9ba1",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#efeff4",
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: string = "ellipse-outline";

          if (route.name === navigationConstants.HOME) {
            iconName = focused ? "flame" : "flame-outline";
          } else if (route.name === navigationConstants.LIKES) {
            iconName = focused ? "heart" : "heart-outline";
          } else if (route.name === navigationConstants.PROFILE) {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name={navigationConstants.HOME} component={HomeRoute} />
      <Tab.Screen name={navigationConstants.LIKES} component={LikesRoute} />
      <Tab.Screen name={navigationConstants.PROFILE} component={Profile} />
    </Tab.Navigator>
  );
};
