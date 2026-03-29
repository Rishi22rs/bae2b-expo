import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { navigationConstants } from "../../constants/app-navigation";
import { ProfileEdit } from "../../screens/profile-edit/index";

const ProfileStack = createNativeStackNavigator();

export const ProfileRoute = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ProfileStack.Screen
        name={navigationConstants.PROFILE_EDIT}
        component={ProfileEdit}
      />
    </ProfileStack.Navigator>
  );
};
