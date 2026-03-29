import {Pressable, View} from 'react-native';
import {TextComponent} from '../../components/TextComponent';
import {TextInputComponent} from '../../components/TextInputComponent';
import {ButtonComponent} from '../../components/ButtonComponent';
import {createStyleSheet} from './style';
import Icon from 'react-native-vector-icons/Ionicons';
import {useState} from 'react';
import {Header} from '../../components/Header';
import {useLogin, useOtp} from '../../api/auth';
import {OtpInput} from 'react-native-otp-entry';
import {useNavigation} from '@react-navigation/native';
import {navigationConstants} from '../../constants/app-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const OtpScreen = ({route}: {route: any}) => {
  const style = createStyleSheet();
  const [otp, setOtp] = useState('');
  const navigation = useNavigation();

  const handleAuth = res => {
    AsyncStorage.setItem('jwt-token', res?.data?.token).then(() =>
      navigation.replace(navigationConstants.STEPPER_SCREEN),
    );
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
          Please enter the OTP sent to your phone no.
        </TextComponent>
        <OtpInput
          numberOfDigits={4}
          onTextChange={text => setOtp(text)}
          theme={{
            containerStyle: style.otpContainer,
          }}
        />
        <TextComponent viewStyle={style.loginSubTitle}>
          Didn’t receive the code? <TextComponent>Resend OTP</TextComponent>
        </TextComponent>
        <ButtonComponent
          buttonText={'Request OTP'}
          textStyle={style.buttonText}
          onPress={() => {
            useOtp({phoneNumber: route?.params?.phoneNumber, otp}).then(
              handleAuth,
            );
          }}
        />
      </View>
    </View>
  );
};
