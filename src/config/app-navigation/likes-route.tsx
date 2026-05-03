import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {navigationConstants} from '../../constants/app-navigation';
import {Likes} from '../../screens/likes/index';
import {LikesProfile} from '../../screens/likes-profile/index';

const LikesStack = createNativeStackNavigator();

export const LikesRoute = () => {
  return (
    <LikesStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <LikesStack.Screen name="likes-screen" component={Likes} />
      <LikesStack.Screen
        name={navigationConstants.LIKES_PROFILE}
        component={LikesProfile}
      />
    </LikesStack.Navigator>
  );
};
