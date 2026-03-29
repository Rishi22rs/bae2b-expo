import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { navigationConstants } from "../../constants/app-navigation";
import { Login } from "../../screens/login/index";
import { LoginScreen } from "../../screens/login/login-screen";
import { OtpScreen } from "../../screens/login/otp-screen";
import { Onboarding } from "../../screens/onboarding/index";

const AuthenticationStack = createNativeStackNavigator();

export const AuthenticationRoute = () => {
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
