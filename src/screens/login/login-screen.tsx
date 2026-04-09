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
import { getApiErrorMessage, getMessageFromPayload } from "../../utils/otp";
import { createStyleSheet } from "./style";

export const LoginScreen = () => {
  const style = createStyleSheet();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [requestError, setRequestError] = useState("");
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const navigation = useNavigation();

  const handleRequestOtp = async () => {
    const normalizedPhone = phoneNumber.replace(/\D/g, "");
    if (!normalizedPhone || normalizedPhone.length < 10) {
      setRequestError("Please enter a valid 10-digit phone number.");
      return;
    }

    setIsRequestingOtp(true);
    setRequestError("");

    try {
      const response = await useLogin({ phone_number: normalizedPhone });
      const serverMessage = getMessageFromPayload(
        response?.data,
        "OTP sent successfully.",
      );

      navigation.navigate(navigationConstants.OTP_PAGE, {
        phoneNumber: normalizedPhone,
        otpMeta: response?.data,
        requestMessage: serverMessage,
      });
    } catch (error) {
      setRequestError(
        getApiErrorMessage(error, "Unable to send OTP. Please try again."),
      );
    } finally {
      setIsRequestingOtp(false);
    }
  };

  return (
    <View>
      <Header />
      <View style={style.loginOtpContainer}>
        <View style={style.titleBackContainer}>
          <Pressable onPress={navigation.goBack} style={style.backBtn}>
            <Icon name="chevron-back" size={24} color="#000" />
          </Pressable>
          <TextComponent viewStyle={style.loginTitle}>
            Enter Phone No.
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
        {!!requestError ? (
          <TextComponent viewStyle={style.errorText}>{requestError}</TextComponent>
        ) : null}
        <ButtonComponent
          buttonText={isRequestingOtp ? "Requesting OTP..." : "Request OTP"}
          textStyle={style.buttonText}
          disabled={isRequestingOtp}
          onPress={handleRequestOtp}
        />
      </View>
    </View>
  );
};
