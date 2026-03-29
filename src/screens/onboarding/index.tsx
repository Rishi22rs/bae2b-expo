import DateTimePicker from '@react-native-community/datetimepicker';
import React, {useState} from 'react';
import {Platform, Pressable, Text, View} from 'react-native';
import {ButtonComponent} from '../../components/ButtonComponent';
import {Chip} from '../../components/ChipComponent';
import {Header} from '../../components/Header';
import {TextInputComponent} from '../../components/TextInputComponent';
import {defaultTheme} from '../../config/theme';
import {hexToRgbA} from '../../utils/hexToRgba';
import {createStyleSheet} from './style';
import {useAddUserInfo} from '../../api/onboarding';
import {useNavigation} from '@react-navigation/native';
import {navigationConstants} from '../../constants/app-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

const genders = ['Woman', 'Man', 'More'];
const orientations = ['Straight', 'Gay', 'Lesbian', 'Bisexual', 'Asexual'];
const passions = ['Music', 'Movies', 'Travel', 'Fitness', 'Cooking', 'Art'];

export const Onboarding = () => {
  const styles = createStyleSheet();
  const [step, setStep] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    birthday: new Date(),
    gender: '',
    orientation: '',
    passions: '',
  });
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => (prev > 0 ? prev - 1 : prev));

  const navigation = useNavigation();

  const isStepValid = () => {
    switch (step) {
      case 0:
        return formData.name.trim().length > 0;
      case 1:
        return (
          formData.birthday instanceof Date &&
          !isNaN(formData.birthday.getTime())
        );
      case 2:
        return formData.gender !== '';
      case 3:
        return formData.orientation !== '';
      case 4:
        return formData.passions.length > 0;
      default:
        return true;
    }
  };

  const togglePassion = (p: string) => {
    setFormData(prev => {
      const exists = prev.passions.includes(p);
      return {
        ...prev,
        passions: exists
          ? prev.passions.filter(item => item !== p)
          : [...prev.passions, p],
      };
    });
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <>
            <Text style={styles.title}>My First Name is</Text>
            <TextInputComponent
              placeholder="First name"
              placeholderTextColor={hexToRgbA(defaultTheme.black, 40)}
              value={formData.name}
              onChangeText={value =>
                setFormData(prev => ({...prev, name: value}))
              }
            />
          </>
        );
      case 1:
        return (
          <>
            <Text style={styles.title}>My Birthday is</Text>

            <Chip
              label={formData?.birthday?.toDateString()}
              onSelect={() => setShowDatePicker(true)}
              chipStyle={{
                paddingVertical: 12,
                borderColor: hexToRgbA(defaultTheme.brown, 0.3),
              }}
              labelStyle={styles.labelStyle}
            />

            {showDatePicker && (
              <DateTimePicker
                mode="date"
                value={formData.birthday}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, date) => {
                  if (date) {
                    setFormData(prev => ({...prev, birthday: date}));
                  }
                  setShowDatePicker(false);
                }}
                maximumDate={new Date()}
              />
            )}
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.title}>I am a</Text>
            <View style={styles.chipContainer}>
              {genders.map(gen => (
                <Chip
                  chipStyle={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                  }}
                  label={gen}
                  onSelect={selected => {
                    setFormData(prev => ({...prev, gender: selected}));
                  }}
                  selected={gen === formData.gender}
                  labelStyle={{
                    fontSize: 14,
                  }}
                />
              ))}
            </View>
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.title}>My Orientation is</Text>
            <View style={styles.chipContainer}>
              {orientations.map(orient => (
                <Chip
                  chipStyle={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                  }}
                  label={orient}
                  onSelect={selected =>
                    setFormData(prev => ({...prev, orientation: selected}))
                  }
                  selected={formData.orientation === orient}
                  labelStyle={{
                    fontSize: 14,
                  }}
                />
              ))}
            </View>
          </>
        );
      case 4:
        return (
          <>
            <Text style={styles.title}>My Passions are</Text>
            <View style={styles.chipContainer}>
              {passions.map(passion => (
                <Chip
                  chipStyle={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                  }}
                  label={passion}
                  onSelect={selected => {
                    togglePassion(selected);
                  }}
                  selected={formData.passions.includes(passion)}
                  labelStyle={{
                    fontSize: 14,
                  }}
                />
              ))}
            </View>
          </>
        );
      default:
        useAddUserInfo({
          ...formData,
          passions: formData.passions.join(','),
        }).then(res =>
          navigation.replace(navigationConstants.BOTTOM_TABS, {
            screen: navigationConstants.HOME,
            params: {},
          }),
        );

        return <Text style={styles.title}>You're all set!</Text>;
    }
  };

  return (
    <>
      <Header prefixTitle="Onboarding" />
      <View style={styles.background}>
        {step !== 0 ? (
          <Pressable onPress={prevStep} style={styles.backBtn}>
            <Icon name="chevron-back" size={34} color="#000" />
          </Pressable>
        ) : null}
        <View style={styles.container}>{renderStepContent()}</View>
        {step < 5 && (
          <ButtonComponent
            buttonText="Continue"
            style={styles.continueButton}
            onPress={nextStep}
            disabled={!isStepValid()}
          />
        )}
      </View>
    </>
  );
};
