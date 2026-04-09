import {Pressable, View} from 'react-native';
import {TextComponent} from '../../components/TextComponent';
import {ButtonComponent} from '../../components/ButtonComponent';
import {createStyleSheet} from './style';
import Icon from 'react-native-vector-icons/Ionicons';
import {useEffect, useMemo, useState} from 'react';
import {Header} from '../../components/Header';
import {useLogin, useOtp} from '../../api/auth';
import {OtpInput} from 'react-native-otp-entry';
import {useNavigation} from '@react-navigation/native';
import {navigationConstants} from '../../constants/app-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  formatSecondsAsClock,
  getApiErrorMessage,
  getMessageFromPayload,
  getOtpAttemptsLeft,
  getOtpExpirySeconds,
} from '../../utils/otp';

export const OtpScreen = ({route}: {route: any}) => {
  const style = createStyleSheet();
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
    getOtpExpirySeconds(otpMeta, 60),
  );

  const navigation = useNavigation();

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const timerLabel = useMemo(() => formatSecondsAsClock(secondsLeft), [secondsLeft]);
  const hasAttemptsRemaining = attemptsLeft === undefined || attemptsLeft > 0;
  const canResendOtp = secondsLeft <= 0 && !isResending && hasAttemptsRemaining;
  const canVerifyOtp = otp.length === 4 && !isVerifying && hasAttemptsRemaining;
  const resendTextStyle = canResendOtp
    ? style.resendText
    : {...style.resendText, ...style.resendTextDisabled};

  const handleAuth = (res: any) => {
    AsyncStorage.setItem('jwt-token', res?.data?.token).then(() =>
      navigation.replace(navigationConstants.STEPPER_SCREEN),
    );
  };

  const handleResendOtp = async () => {
    if (!phoneNumber || isResending) {
      return;
    }

    setIsResending(true);
    setErrorMessage('');

    try {
      const resendResponse = await useLogin({phone_number: phoneNumber});
      const responseData = resendResponse?.data || {};
      const responseMessage = getMessageFromPayload(
        responseData,
        'OTP resent successfully.',
      );

      setInfoMessage(responseMessage);
      setOtp('');
      setSecondsLeft(getOtpExpirySeconds(responseData, 60));
      setAttemptsLeft(getOtpAttemptsLeft(responseData));
    } catch (error) {
      setInfoMessage('');
      const errorData = (error as {response?: {data?: unknown}})?.response?.data;
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
      setInfoMessage('');
      const errorData = (error as {response?: {data?: unknown}})?.response?.data;
      setErrorMessage(
        getApiErrorMessage(error, 'Invalid OTP. Please try again.'),
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
      setIsVerifying(false);
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
            Enter your OTP
          </TextComponent>
        </View>
        <TextComponent viewStyle={style.loginSubTitle}>
          Please enter the OTP sent to {phoneNumber || 'your phone number'}.
        </TextComponent>
        <OtpInput
          numberOfDigits={4}
          onTextChange={text => setOtp(text)}
          theme={{
            containerStyle: style.otpContainer,
          }}
        />
        <View style={style.statusRow}>
          <TextComponent viewStyle={style.timerText}>
            {secondsLeft > 0
              ? `OTP expires in ${timerLabel}`
              : 'OTP expired. You can resend now.'}
          </TextComponent>
          {typeof attemptsLeft === 'number' ? (
            <TextComponent viewStyle={style.attemptsText}>
              Attempts left: {attemptsLeft}
            </TextComponent>
          ) : null}
        </View>
        <View style={style.resendRow}>
          <TextComponent viewStyle={style.loginSubTitleCompact}>
            Didn’t receive the code?
          </TextComponent>
          <Pressable
            disabled={!canResendOtp}
            onPress={handleResendOtp}
            style={style.resendButton}>
            <TextComponent viewStyle={resendTextStyle}>
              {isResending
                ? 'Resending...'
                : canResendOtp
                  ? 'Resend OTP'
                  : `Resend in ${timerLabel}`}
            </TextComponent>
          </Pressable>
        </View>
        {!!infoMessage ? (
          <TextComponent viewStyle={style.infoMessage}>{infoMessage}</TextComponent>
        ) : null}
        {!!errorMessage ? (
          <TextComponent viewStyle={style.errorText}>{errorMessage}</TextComponent>
        ) : null}
        {attemptsLeft === 0 && !errorMessage ? (
          <TextComponent viewStyle={style.errorText}>
            OTP attempts exhausted. Please request a new OTP.
          </TextComponent>
        ) : null}
        <ButtonComponent
          buttonText={isVerifying ? 'Verifying...' : 'Verify OTP'}
          textStyle={style.buttonText}
          disabled={!canVerifyOtp}
          onPress={handleOtpVerify}
        />
      </View>
    </View>
  );
};
