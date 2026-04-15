import {CommonActions, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StatusBar} from 'expo-status-bar';
import {useEffect, useMemo, useState} from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  Text,
} from 'react-native';
import {OtpInput} from 'react-native-otp-entry';
import Icon from 'react-native-vector-icons/Ionicons';
import {useLogin, useOtp} from '../../api/auth';
import {KeyboardScreenLayout} from '../../components/KeyboardScreenLayout';
import {TextComponent} from '../../components/TextComponent';
import {navigationConstants} from '../../constants/app-navigation';
import {
  getApiErrorMessage,
  getMessageFromPayload,
  getOtpAttemptsLeft,
  getOtpExpirySeconds,
} from '../../utils/otp';
import {goBackWithWebFallback} from '../../utils/navigation-back';
import {createStyleSheet} from './style';

export const OtpScreen = ({route}: {route: any}) => {
  const style = createStyleSheet();
  const navigation = useNavigation();
  const phoneNumber = route?.params?.phoneNumber || '';
  const otpMeta = route?.params?.otpMeta || route?.params || {};

  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState(
    route?.params?.requestMessage || getMessageFromPayload(otpMeta, ''),
  );
  const [attemptsLeft, setAttemptsLeft] = useState<number | undefined>(() =>
    getOtpAttemptsLeft(otpMeta),
  );
  const [secondsLeft, setSecondsLeft] = useState(() =>
    getOtpExpirySeconds(otpMeta, 30),
  );

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const hasAttemptsRemaining = attemptsLeft === undefined || attemptsLeft > 0;
  const canResendOtp = secondsLeft <= 0 && !isResending && hasAttemptsRemaining;
  const canVerifyOtp = otp.length === 4 && !isVerifying && hasAttemptsRemaining;
  const resendLabel = canResendOtp
    ? isResending
      ? 'Resending code...'
      : 'Resend code'
    : `Resend code in ${secondsLeft}s`;
  const maskedPhone = useMemo(
    () => (phoneNumber ? `+91 - ${phoneNumber}` : '+91 - your number'),
    [phoneNumber],
  );

  const handleAuth = (res: any) => {
    AsyncStorage.setItem('jwt-token', res?.data?.token).then(() => {
      const rootResetAction = CommonActions.reset({
        index: 0,
        routes: [{name: navigationConstants.STEPPER_SCREEN}],
      });

      (navigation as any).dispatch(rootResetAction);

      // On web, ensure the OTP entry is replaced so browser-back won't return here.
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.history.replaceState(
          window.history.state,
          '',
          `/${navigationConstants.STEPPER_SCREEN}`,
        );
      }
    });
  };

  const handleResendOtp = async () => {
    if (!phoneNumber || isResending || !canResendOtp) {
      return;
    }

    setIsResending(true);
    setErrorMessage('');

    try {
      const resendResponse = await useLogin({phone_number: phoneNumber});
      const responseData = resendResponse?.data || {};
      setInfoMessage(getMessageFromPayload(responseData, 'OTP resent successfully.'));
      setOtp('');
      setSecondsLeft(getOtpExpirySeconds(responseData, 30));
      setAttemptsLeft(getOtpAttemptsLeft(responseData));
    } catch (error) {
      const errorData = (error as {response?: {data?: unknown}})?.response?.data;
      setInfoMessage('');
      setErrorMessage(
        getApiErrorMessage(error, 'Unable to resend OTP. Please try again.'),
      );

      const nextAttempts = getOtpAttemptsLeft(errorData);
      if (nextAttempts !== undefined) {
        setAttemptsLeft(nextAttempts);
      }

      const nextExpiry = getOtpExpirySeconds(errorData, 0);
      if (nextExpiry > 0) {
        setSecondsLeft(nextExpiry);
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpVerify = async () => {
    if (!phoneNumber) {
      setErrorMessage('Phone number not found. Please request OTP again.');
      return;
    }

    if (!otp || otp.length < 4) {
      setErrorMessage('Please enter the 4-digit OTP.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');

    try {
      const verifyResponse = await useOtp({phoneNumber, otp});
      setInfoMessage(
        getMessageFromPayload(verifyResponse?.data, 'OTP verified successfully.'),
      );
      handleAuth(verifyResponse);
    } catch (error) {
      const errorData = (error as {response?: {data?: unknown}})?.response?.data;
      setInfoMessage('');
      setErrorMessage(getApiErrorMessage(error, 'Invalid OTP. Please try again.'));

      const nextAttempts = getOtpAttemptsLeft(errorData);
      if (nextAttempts !== undefined) {
        setAttemptsLeft(nextAttempts);
      }

      const nextExpiry = getOtpExpirySeconds(errorData, 0);
      if (nextExpiry > 0) {
        setSecondsLeft(nextExpiry);
      }
    } finally {
      setIsVerifying(false);
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
            disabled={!canVerifyOtp}
            onPress={handleOtpVerify}
            style={[
              style.authPrimaryButton,
              !canVerifyOtp ? style.authPrimaryButtonDisabled : null,
            ]}>
            <TextComponent
              viewStyle={
                canVerifyOtp
                  ? style.authPrimaryButtonText
                  : {
                      ...style.authPrimaryButtonText,
                      ...style.authPrimaryButtonTextDisabled,
                    }
              }>
              {isVerifying ? 'Verifying OTP...' : 'Verify OTP'}
            </TextComponent>
          </Pressable>
        }>
        <Icon name="phone-portrait-outline" size={26} color="#111111" />

        <TextComponent viewStyle={style.authTitle}>Enter the code</TextComponent>

        <Text style={style.authSubtitleLine}>
          <Text style={style.authSubtitleText}>Code sent to </Text>
          <Text style={style.authSubtitleStrong}>{maskedPhone}</Text>
          <Text style={style.authSubtitleText}> · </Text>
          <Text
            style={style.authSubtitleEdit}
            onPress={() =>
              goBackWithWebFallback(navigation as any, {
                screen: navigationConstants.LOGIN_PAGE,
              })
            }>
            Edit
          </Text>
        </Text>

        <OtpInput
          numberOfDigits={4}
          onTextChange={setOtp}
          placeholder="0"
          theme={{
            containerStyle: style.otpWrap,
            pinCodeContainerStyle: style.otpPinContainer,
            focusedPinCodeContainerStyle: style.otpPinContainerFocused,
            filledPinCodeContainerStyle: style.otpPinContainerFilled,
            pinCodeTextStyle: style.otpPinText,
            placeholderTextStyle: style.otpPlaceholderText,
          }}
        />

        <Pressable
          disabled={!canResendOtp}
          onPress={handleResendOtp}
          style={style.resendButton}>
          <TextComponent
            viewStyle={
              canResendOtp
                ? style.resendText
                : {
                    ...style.resendText,
                    ...style.resendTextDisabled,
                  }
            }>
            {resendLabel}
          </TextComponent>
        </Pressable>

        {!!errorMessage ? (
          <TextComponent viewStyle={style.authErrorText}>{errorMessage}</TextComponent>
        ) : null}
        {!!infoMessage ? (
          <TextComponent viewStyle={style.authInfoText}>{infoMessage}</TextComponent>
        ) : null}
      </KeyboardScreenLayout>
    </SafeAreaView>
  );
};
