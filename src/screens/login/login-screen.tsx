import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useLogin } from "../../api/auth";
import { ButtonComponent } from "../../components/ButtonComponent";
import { Header } from "../../components/Header";
import { TextComponent } from "../../components/TextComponent";
import { TextInputComponent } from "../../components/TextInputComponent";
import { navigationConstants } from "../../constants/app-navigation";
import { createStyleSheet } from "./style";

export const LoginScreen = () => {
  const style = createStyleSheet();
  const [phoneNumber, setPhoneNumber] = useState();
  const navigation = useNavigation();
  return (
    <View>
      <Header />
      <View style={style.loginOtpContainer}>
        <View style={style.titleBackContainer}>
          <Pressable onPress={navigation.goBack} style={style.backBtn}>
            <Icon name="chevron-back" size={24} color="#000" />
          </Pressable>
          <TextComponent viewStyle={style.loginTitle}>
            Enter Phone No.rishi
          </TextComponent>
        </View>
        <TextComponent viewStyle={style.loginSubTitle}>
          Please enter your active phone no.
        </TextComponent>
        <TextInputComponent
          maxLength={10}
          showIcon={false}
          placeholderTextColor={"#B8B8B8"}
          placeholder="Enter Phone Number"
          onChangeText={(number) => setPhoneNumber(number)}
          viewStyle={style.input}
          keyboardType="phone-pad"
        />
        <ButtonComponent
          buttonText={"Request OTP"}
          textStyle={style.buttonText}
          onPress={() =>
            useLogin({ phone_number: phoneNumber }).then((data) => {
              navigation.navigate(navigationConstants.OTP_PAGE, {
                phoneNumber,
              });
            })
          }
        />
      </View>
    </View>
  );
};
