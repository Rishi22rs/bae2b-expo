import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { navigationConstants } from "../../constants/app-navigation";
import { Chat } from "../../screens/chat/index";
import { ItsAMatch } from "../../screens/match-screen/index";
import { ViewOnlyProfile } from "../../screens/view-only-profile/index";

const MatchStack = createNativeStackNavigator();

export const MatchMRoute = () => {
  return (
    <MatchStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MatchStack.Screen
        name={navigationConstants.ITS_A_MATCH}
        component={ItsAMatch}
      />
      <MatchStack.Screen name={navigationConstants.CHAT} component={Chat} />
      <MatchStack.Screen
        name={navigationConstants.VIEW_ONLY_PROFILE}
        component={ViewOnlyProfile}
      />
    </MatchStack.Navigator>
  );
};
