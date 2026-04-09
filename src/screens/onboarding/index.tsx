import DateTimePicker from '@react-native-community/datetimepicker';
import React, {useState} from 'react';
import {Platform, Pressable, Text, View} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  FadeInDown,
  FadeOutDown,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
  ZoomIn,
} from 'react-native-reanimated';
import {ButtonComponent} from '../../components/ButtonComponent';
import {Chip} from '../../components/ChipComponent';
import {DatePickerField} from '../../components/DatePickerField/index';
import {Header} from '../../components/Header';
import {TextInputComponent} from '../../components/TextInputComponent';
import {defaultTheme} from '../../config/theme';
import {hexToRgbA} from '../../utils/hexToRgba';
import {createStyleSheet} from './style';
import {useAddUserInfo} from '../../api/onboarding';
import {useNavigation} from '@react-navigation/native';
import {navigationConstants} from '../../constants/app-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {onboardingConfig} from './config';

const totalSteps = onboardingConfig.steps.length;
const WebDateInput = 'input' as any;

export const Onboarding = () => {
  const styles = createStyleSheet();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [submitState, setSubmitState] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [submitError, setSubmitError] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    birthday: false,
  });
  const [formData, setFormData] = useState({
    name: '',
    birthday: new Date(),
    gender: '',
    orientation: '',
    passions: [] as string[],
  });
  const nextStep = () => {
    setDirection('forward');
    setStep(prev => prev + 1);
  };
  const prevStep = () => {
    setDirection('backward');
    setStep(prev => (prev > 0 ? prev - 1 : prev));
  };

  const navigation = useNavigation();
  const isSubmitting = submitState === 'loading' || submitState === 'success';
  const progressPercent = ((step + 1) / totalSteps) * 100;
  const currentStepConfig = onboardingConfig.steps[step];
  const today = new Date();
  const webTodayDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const isStepValid = () => {
    switch (currentStepConfig?.id) {
      case 'name':
        return getNameValidationError(formData.name) === '';
      case 'birthday':
        return getBirthdayValidationError(formData.birthday) === '';
      case 'gender':
        return formData.gender !== '';
      case 'orientation':
        return formData.orientation !== '';
      case 'passions':
        return formData.passions.length > 0;
      default:
        return true;
    }
  };

  const getNameValidationError = (nameValue: string) => {
    if (!nameValue.trim()) {
      return onboardingConfig.validation.nameRequired;
    }

    return '';
  };

  const calculateAge = (birthDate: Date) => {
    const todayDate = new Date();
    let age = todayDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = todayDate.getMonth() - birthDate.getMonth();
    const dayDiff = todayDate.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age -= 1;
    }

    return age;
  };

  const getBirthdayValidationError = (birthdayValue: Date) => {
    if (!(birthdayValue instanceof Date) || Number.isNaN(birthdayValue.getTime())) {
      return onboardingConfig.validation.birthdayRequired;
    }

    const age = calculateAge(birthdayValue);
    if (age < onboardingConfig.minimumAge) {
      return onboardingConfig.validation.birthdayMinimumAge(
        onboardingConfig.minimumAge,
      );
    }

    return '';
  };

  const nameError = touched.name ? getNameValidationError(formData.name) : '';
  const birthdayError = touched.birthday
    ? getBirthdayValidationError(formData.birthday)
    : '';

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    setSubmitError('');
    setSubmitState('loading');
    try {
      await useAddUserInfo({
        ...formData,
        passions: formData.passions.join(','),
      });
      setSubmitState('success');
      setTimeout(() => {
        navigation.replace(navigationConstants.BOTTOM_TABS, {
          screen: navigationConstants.HOME,
          params: {},
        });
      }, onboardingConfig.success.navigateDelayMs);
    } catch (error) {
      const responseMessage = (error as {response?: {data?: {message?: string}}})
        ?.response?.data?.message;
      setSubmitError(
        responseMessage || 'Could not complete onboarding. Please try again.',
      );
      setSubmitState('error');
      console.error('Onboarding submit failed:', error);
    }
  };

  const handleContinue = () => {
    if (submitState === 'error') {
      setSubmitState('idle');
      setSubmitError('');
    }

    if (!isStepValid()) {
      if (currentStepConfig?.id === 'name') {
        setTouched(prev => ({...prev, name: true}));
      }

      if (currentStepConfig?.id === 'birthday') {
        setTouched(prev => ({...prev, birthday: true}));
      }

      return;
    }

    if (step < totalSteps - 1) {
      nextStep();
      return;
    }

    handleSubmit();
  };

  const handleDateChange = (
    event: {type?: string},
    date?: Date,
  ) => {
    if (event?.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }

    if (date) {
      setFormData(prev => ({...prev, birthday: date}));
      setTouched(prev => ({...prev, birthday: true}));
    }

    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
  };

  const openBirthdayPicker = () => {
    if (Platform.OS === 'web') {
      return;
    }

    setShowDatePicker(true);
  };

  const webBirthdayValue = `${formData.birthday.getFullYear()}-${String(
    formData.birthday.getMonth() + 1,
  ).padStart(2, '0')}-${String(formData.birthday.getDate()).padStart(2, '0')}`;
  const formattedBirthday = formData.birthday.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleWebDateInputChange = (event: any) => {
    const value = event?.target?.value;
    if (!value) {
      return;
    }

    const [year, month, day] = String(value)
      .split('-')
      .map(part => Number(part));
    const selectedDate = new Date(year, month - 1, day);

    if (!Number.isNaN(selectedDate.getTime())) {
      setFormData(prev => ({...prev, birthday: selectedDate}));
      setTouched(prev => ({...prev, birthday: true}));
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

  const renderSelectionChips = ({
    options,
    selectedValue,
    onSelect,
    multiple = false,
  }: {
    options: string[];
    selectedValue: string | string[];
    onSelect: (selected: string) => void;
    multiple?: boolean;
  }) => {
    return (
      <View style={styles.fieldBlock}>
        <View style={styles.chipContainer}>
          {options.map(option => {
            const isSelected = multiple
              ? Array.isArray(selectedValue) && selectedValue.includes(option)
              : selectedValue === option;

            return (
              <Chip
                key={option}
                chipStyle={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                }}
                label={option}
                onSelect={onSelect}
                selected={isSelected}
                labelStyle={{
                  fontSize: 14,
                }}
              />
            );
          })}
        </View>
      </View>
    );
  };

  const renderStepFields = () => {
    switch (currentStepConfig?.id) {
      case 'name':
        return (
          <View style={styles.fieldBlock}>
            <TextInputComponent
              label={currentStepConfig.fieldLabel}
              required={currentStepConfig.required}
              placeholder={currentStepConfig.placeholder}
              placeholderTextColor={hexToRgbA(defaultTheme.black, 40)}
              value={formData.name}
              error={nameError}
              onChangeText={value =>
                setFormData(prev => ({...prev, name: value}))
              }
              onBlur={() => setTouched(prev => ({...prev, name: true}))}
            />
          </View>
        );
      case 'birthday':
        return (
          <View style={styles.fieldBlock}>
            <DatePickerField
              label={currentStepConfig.fieldLabel}
              required={currentStepConfig.required}
              value={formattedBirthday}
              onPress={openBirthdayPicker}
              error={birthdayError}
              iconColor={defaultTheme.pinkText}
              fieldStyle={styles.datePickerTrigger}>
              {Platform.OS === 'web' ? (
                <WebDateInput
                  type="date"
                  value={webBirthdayValue}
                  max={webTodayDate}
                  onChange={handleWebDateInputChange}
                  aria-label="Birthday"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                  }}
                />
              ) : null}
            </DatePickerField>

            {showDatePicker && Platform.OS !== 'web' && (
              <DateTimePicker
                mode="date"
                value={formData.birthday}
                display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}

            {showDatePicker && Platform.OS === 'ios' ? (
              <Pressable
                onPress={() => setShowDatePicker(false)}
                style={styles.dateDoneButton}>
                <Text style={styles.dateDoneButtonText}>Done</Text>
              </Pressable>
            ) : null}
          </View>
        );
      case 'gender':
      case 'orientation':
      case 'passions':
        return renderSelectionChips({
          options: currentStepConfig.options,
          selectedValue:
            currentStepConfig.id === 'gender'
              ? formData.gender
              : currentStepConfig.id === 'orientation'
                ? formData.orientation
                : formData.passions,
          onSelect: selected => {
            if (currentStepConfig.id === 'gender') {
              setFormData(prev => ({...prev, gender: selected}));
              return;
            }

            if (currentStepConfig.id === 'orientation') {
              setFormData(prev => ({...prev, orientation: selected}));
              return;
            }

            togglePassion(selected);
          },
          multiple: currentStepConfig.selectionMode === 'multiple',
        });
      default:
        return null;
    }
  };

  return (
    <View style={styles.wrapper}>
      <Header prefixTitle="Onboarding" />
      <View style={styles.background}>
        <View style={styles.progressHeader}>
          <Text style={styles.stepText}>
            Step {step + 1} of {totalSteps}
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, {width: `${progressPercent}%`}]} />
          </View>
        </View>

        <Animated.View
          key={step}
          entering={
            direction === 'forward'
              ? SlideInRight.duration(260)
              : SlideInLeft.duration(260)
          }
          exiting={
            direction === 'forward'
              ? SlideOutLeft.duration(220)
              : SlideOutRight.duration(220)
          }
          style={styles.container}>
          <View style={styles.cardTopRow}>
            {step !== 0 ? (
              <Pressable onPress={prevStep} style={styles.inlineBackBtn}>
                <Icon name="chevron-back" size={22} color={defaultTheme.darkText} />
                <Text style={styles.inlineBackLabel}>Back</Text>
              </Pressable>
            ) : (
              <View style={styles.inlineBackPlaceholder} />
            )}
          </View>
          <Text style={styles.title}>{currentStepConfig?.title}</Text>
          <Text style={styles.subtitle}>{currentStepConfig?.subtitle}</Text>
          {renderStepFields()}
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(320)} exiting={FadeOutDown.duration(180)}>
          <ButtonComponent
            buttonText={
              isSubmitting
                ? onboardingConfig.cta.saving
                : step === totalSteps - 1
                  ? onboardingConfig.cta.finish
                  : onboardingConfig.cta.continue
            }
            viewStyle={styles.continueButton}
            onPress={handleContinue}
            disabled={!isStepValid() || isSubmitting}
          />
          {submitState === 'error' && submitError ? (
            <Text style={styles.submitErrorText}>{submitError}</Text>
          ) : null}
        </Animated.View>
      </View>

      {submitState === 'success' ? (
        <Animated.View entering={FadeIn.duration(220)} exiting={FadeOut.duration(180)} style={styles.successOverlay}>
          <Animated.View entering={ZoomIn.duration(280)} style={styles.successCard}>
            <Icon name="checkmark-circle" size={74} color={defaultTheme.pinkPrimary} />
            <Text style={styles.successTitle}>{onboardingConfig.success.title}</Text>
            <Text style={styles.successSubtitle}>
              {onboardingConfig.success.subtitle}
            </Text>
          </Animated.View>
        </Animated.View>
      ) : null}
    </View>
  );
};
