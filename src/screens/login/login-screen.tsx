import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  TextInput,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useLogin } from "../../api/auth";
import { KeyboardScreenLayout } from "../../components/KeyboardScreenLayout";
import { TextComponent } from "../../components/TextComponent";
import { navigationConstants } from "../../constants/app-navigation";
import { getApiErrorMessage, getMessageFromPayload } from "../../utils/otp";
import { createStyleSheet } from "./style";

export const LoginScreen = () => {
  const style = createStyleSheet();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [requestError, setRequestError] = useState("");
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const navigation = useNavigation();

  const normalizedPhone = useMemo(
    () => phoneNumber.replace(/\D/g, ""),
    [phoneNumber],
  );
  const canRequestOtp = normalizedPhone.length >= 10 && !isRequestingOtp;

  const handleRequestOtp = async () => {
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

      (navigation as any).navigate(navigationConstants.OTP_PAGE, {
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
    <SafeAreaView style={style.authRoot}>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <KeyboardScreenLayout
        containerStyle={style.authContainer}
        contentContainerStyle={style.authBody}
        footerContainerStyle={style.authFooter}
        footer={
          <Pressable
            disabled={!canRequestOtp}
            onPress={handleRequestOtp}
            style={[
              style.authPrimaryButton,
              !canRequestOtp ? style.authPrimaryButtonDisabled : null,
            ]}
          >
            <TextComponent
              viewStyle={
                canRequestOtp
                  ? style.authPrimaryButtonText
                  : {
                      ...style.authPrimaryButtonText,
                      ...style.authPrimaryButtonTextDisabled,
                    }
              }
            >
              {isRequestingOtp ? "Requesting code..." : "Get Verification code"}
            </TextComponent>
          </Pressable>
        }
      >
        <Icon name="phone-portrait-outline" size={26} color="#111111" />

        <TextComponent viewStyle={style.authTitle}>
          Enter your digits.
        </TextComponent>

        <View style={style.phoneRow}>
          <View style={style.countryCard}>
            <TextComponent viewStyle={style.authFieldLabel}>
              Country
            </TextComponent>
            <View style={style.countryValueRow}>
              <TextComponent viewStyle={style.countryFlag}>🇮🇳</TextComponent>
              <TextComponent viewStyle={style.phoneValueText}>
                +91
              </TextComponent>
            </View>
          </View>

          <View style={style.phoneCard}>
            <TextComponent viewStyle={style.authFieldLabel}>
              Your Phone Number
            </TextComponent>
            <View style={style.phoneInputWrap}>
              <TextInput
                value={phoneNumber}
                onChangeText={(value) =>
                  setPhoneNumber(value.replace(/[^\d]/g, "").slice(0, 10))
                }
                style={style.phoneInput}
                placeholder="9999999999"
                placeholderTextColor="#b9b9b9"
                maxLength={10}
                keyboardType={Platform.OS === "web" ? "numeric" : "phone-pad"}
                autoCorrect={false}
                autoCapitalize="none"
                autoComplete="tel"
                underlineColorAndroid="transparent"
              />
            </View>
          </View>
        </View>

        {!!requestError ? (
          <TextComponent viewStyle={style.authErrorText}>
            {requestError}
          </TextComponent>
        ) : null}
      </KeyboardScreenLayout>
    </SafeAreaView>
  );
};
