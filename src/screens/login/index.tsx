import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useRef, useState} from 'react';
import {Image, ImageBackground, Pressable, Text, View} from 'react-native';
import {OtpInput} from 'react-native-otp-entry';
import {useLogin, useOtp} from '../../api/auth';
import {ButtonComponent} from '../../components/ButtonComponent';
import {TextComponent} from '../../components/TextComponent';
import {TextInputComponent} from '../../components/TextInputComponent';
import {navigationConstants} from '../../constants/app-navigation';
import {createStyleSheet} from './style';
import Icon from 'react-native-vector-icons/Ionicons';
import Carousel, {
  ICarouselInstance,
  Pagination,
} from 'react-native-reanimated-carousel';
import {useSharedValue} from 'react-native-reanimated';
import {screenHeight, screenWidth} from '../../utils/dimensions';
import {Header} from '../../components/Header';

const data = [
  {
    image: require('../../assets/car1.png'),
    title: 'Modern dating is broken.',
    subTitle: 'Too many matches. Not enough meaning.',
  },
  {
    image: require('../../assets/car2.png'),
    title: 'One match at a time.',
    subTitle:
      'You can’t like anyone else until you unmatch. Because trust starts on Day 1.',
  },
  {
    image: require('../../assets/car3.png'),
    title: 'This isn’t for players.',
    subTitle: 'This is for people who want to build something real.',
  },
];

export const Login = ({route}) => {
  const style = createStyleSheet();

  const [phoneNumber, setPhoneNumber] = useState();
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [otp, setOtp] = useState('');

  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const handleAuth = res => {
    AsyncStorage.setItem('jwt-token', res?.data?.token).then(() =>
      navigation.replace(navigationConstants.STEPPER_SCREEN),
    );
  };

  const handleSteps = (step: number) => {
    if (step === 1) {
      setCurrentStep(step);
    }
    if (step === 2) {
      useLogin({phone_number: phoneNumber}).then(data => {
        setCurrentStep(step);
      });
    }
    if (step === 3) {
      useOtp({phoneNumber, otp}).then(handleAuth);
    }
  };

  return (
    <>
      <Header prefixTitle="Yours" />
      <View style={style.background}>
        <Carousel
          ref={ref}
          width={screenWidth}
          height={screenHeight}
          data={data}
          onProgressChange={progress}
          autoPlay
          renderItem={({item, index}) => (
            <View>
              <Image
                source={item.image}
                style={{height: screenHeight - 400, width: screenWidth}}
                resizeMode="cover"
              />
              <View style={style.textContainer}>
                <Text style={style.carouselTitle}>{item.title}</Text>
                <Text style={style.carouselSubTitle}>{item.subTitle}</Text>
              </View>
            </View>
          )}
        />
        <TextComponent viewStyle={style.title}>Best App</TextComponent>
        <View style={style.loginContainer}>
          {currentStep === 0 && (
            <View>
              <ButtonComponent
                buttonText={'Login'}
                textStyle={style.buttonText}
                onPress={() =>
                  navigation.navigate(navigationConstants.LOGIN_PAGE)
                }
              />
            </View>
          )}
          {currentStep === 1 && (
            <View>
              <View style={style.titleBackContainer}>
                <Pressable
                  onPress={() => {
                    setCurrentStep(prev => prev - 1);
                  }}
                  style={style.backBtn}>
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
                placeholderTextColor={'#B8B8B8'}
                placeholder="Enter Phone Number"
                onChangeText={number => setPhoneNumber(number)}
                viewStyle={style.input}
                keyboardType="phone-pad"
              />
              <ButtonComponent
                buttonText={'Request OTP'}
                textStyle={style.buttonText}
                onPress={() => handleSteps(2)}
              />
            </View>
          )}
          {currentStep === 2 && (
            <View>
              <View style={style.titleBackContainer}>
                <Pressable
                  onPress={() => {
                    setCurrentStep(prev => prev - 1);
                  }}
                  style={style.backBtn}>
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
                Didn’t receive the code?{' '}
                <TextComponent>Resend OTP</TextComponent>
              </TextComponent>
              <ButtonComponent
                buttonText={'Request OTP'}
                textStyle={style.buttonText}
                onPress={() => handleSteps(3)}
              />
            </View>
          )}
        </View>
      </View>
    </>
  );
};
