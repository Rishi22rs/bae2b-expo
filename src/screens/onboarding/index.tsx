import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
  ZoomIn,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/Ionicons";
import { uploadImageToCloudinary, useAddUserInfo } from "../../api/onboarding";
import { ButtonComponent } from "../../components/ButtonComponent";
import { Chip } from "../../components/ChipComponent";
import { DatePickerField } from "../../components/DatePickerField";
import { Header } from "../../components/Header";
import { KeyboardScreenLayout } from "../../components/KeyboardScreenLayout";
import { TextInputComponent } from "../../components/TextInputComponent";
import { defaultTheme } from "../../config/theme";
import { navigationConstants } from "../../constants/app-navigation";
import { hexToRgbA } from "../../utils/hexToRgba";
import { onboardingConfig } from "./config";
import { createStyleSheet } from "./style";

const totalSteps = onboardingConfig.steps.length;

export const Onboarding = () => {
  const styles = createStyleSheet();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [submitError, setSubmitError] = useState("");
  const [touched, setTouched] = useState({
    name: false,
    birthday: false,
    photos: false,
  });
  const [formData, setFormData] = useState({
    name: "",
    birthday: new Date(),
    gender: "",
    orientation: "",
    passions: [] as string[],
    photos: ["", "", "", ""] as string[],
  });
  const nextStep = () => {
    setDirection("forward");
    setStep((prev) => prev + 1);
  };
  const prevStep = () => {
    setDirection("backward");
    setStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const navigation = useNavigation<any>();
  const isSubmitting = submitState === "loading" || submitState === "success";
  const progressPercent = ((step + 1) / totalSteps) * 100;
  const currentStepConfig = onboardingConfig.steps[step];
  const isStepValid = () => {
    switch (currentStepConfig?.id) {
      case "name":
        return getNameValidationError(formData.name) === "";
      case "birthday":
        return getBirthdayValidationError(formData.birthday) === "";
      case "gender":
        return formData.gender !== "";
      case "orientation":
        return formData.orientation !== "";
      case "passions":
        return formData.passions.length > 0;
      case "photos":
        return getPhotosValidationError(formData.photos) === "";
      default:
        return true;
    }
  };

  const getNameValidationError = (nameValue: string) => {
    if (!nameValue.trim()) {
      return onboardingConfig.validation.nameRequired;
    }

    return "";
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
    if (
      !(birthdayValue instanceof Date) ||
      Number.isNaN(birthdayValue.getTime())
    ) {
      return onboardingConfig.validation.birthdayRequired;
    }

    const age = calculateAge(birthdayValue);
    if (age < onboardingConfig.minimumAge) {
      return onboardingConfig.validation.birthdayMinimumAge(
        onboardingConfig.minimumAge,
      );
    }

    return "";
  };

  const nameError = touched.name ? getNameValidationError(formData.name) : "";
  const birthdayError = touched.birthday
    ? getBirthdayValidationError(formData.birthday)
    : "";
  const getPhotosValidationError = (photosValue: string[]) => {
    const currentStep = onboardingConfig.steps.find(
      (configStep) => configStep.id === "photos",
    );
    const minimumPhotos =
      currentStep?.id === "photos" ? currentStep.minPhotos : 1;
    const validPhotosCount = photosValue.filter(Boolean).length;

    if (validPhotosCount < minimumPhotos) {
      return onboardingConfig.validation.photosRequired(minimumPhotos);
    }

    return "";
  };
  const photosError = touched.photos
    ? getPhotosValidationError(formData.photos)
    : "";

  const pickPhoto = async (index: number) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setSubmitError("Please allow photo access to add your images.");
      setSubmitState("error");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.85,
      selectionLimit: 1,
    });

    if (result.canceled || !result.assets?.[0]?.uri) {
      return;
    }

    const nextUri = result.assets[0].uri;
    setFormData((prev) => {
      const nextPhotos = [...prev.photos];
      nextPhotos[index] = nextUri;
      return { ...prev, photos: nextPhotos };
    });
    setTouched((prev) => ({ ...prev, photos: true }));
    setSubmitError("");
    if (submitState === "error") {
      setSubmitState("idle");
    }
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => {
      const nextPhotos = [...prev.photos];
      nextPhotos[index] = "";
      return { ...prev, photos: nextPhotos };
    });
    setTouched((prev) => ({ ...prev, photos: true }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    setSubmitError("");
    setSubmitState("loading");
    try {
      const selectedPhotos = formData.photos.filter(Boolean);
      const uploadedPhotos = await Promise.all(
        selectedPhotos.map((photoUri) => uploadImageToCloudinary(photoUri)),
      );
      await useAddUserInfo({
        ...formData,
        passions: formData.passions.join(","),
        profileImage: uploadedPhotos[0] || "",
        images: uploadedPhotos,
        photos: uploadedPhotos,
      });
      setSubmitState("success");
      setTimeout(() => {
        navigation.replace(navigationConstants.BOTTOM_TABS, {
          screen: navigationConstants.HOME,
          params: {},
        });
      }, onboardingConfig.success.navigateDelayMs);
    } catch (error) {
      const responseMessage = (
        error as { response?: { data?: { message?: string } } }
      )?.response?.data?.message;
      setSubmitError(
        responseMessage || "Could not complete onboarding. Please try again.",
      );
      setSubmitState("error");
      console.error("Onboarding submit failed:", error);
    }
  };

  const handleContinue = () => {
    if (submitState === "error") {
      setSubmitState("idle");
      setSubmitError("");
    }

    if (!isStepValid()) {
      if (currentStepConfig?.id === "name") {
        setTouched((prev) => ({ ...prev, name: true }));
      }

      if (currentStepConfig?.id === "birthday") {
        setTouched((prev) => ({ ...prev, birthday: true }));
      }

      if (currentStepConfig?.id === "photos") {
        setTouched((prev) => ({ ...prev, photos: true }));
      }

      return;
    }

    if (step < totalSteps - 1) {
      nextStep();
      return;
    }

    handleSubmit();
  };

  const togglePassion = (p: string) => {
    setFormData((prev) => {
      const exists = prev.passions.includes(p);
      return {
        ...prev,
        passions: exists
          ? prev.passions.filter((item) => item !== p)
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
          {options.map((option) => {
            const isSelected = multiple
              ? Array.isArray(selectedValue) && selectedValue.includes(option)
              : selectedValue === option;

            return (
              <Chip
                key={option}
                chipStyle={
                  {
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                  } as object
                }
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
      case "name":
        return (
          <View style={styles.fieldBlock}>
            <TextInputComponent
              label={currentStepConfig.fieldLabel}
              required={currentStepConfig.required}
              placeholder={currentStepConfig.placeholder}
              placeholderTextColor={hexToRgbA(defaultTheme.black, 40)}
              value={formData.name}
              error={nameError}
              onChangeText={(value) =>
                setFormData((prev) => ({ ...prev, name: value }))
              }
              onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
            />
          </View>
        );
      case "birthday":
        return (
          <View style={styles.fieldBlock}>
            <DatePickerField
              label={currentStepConfig.fieldLabel}
              required={currentStepConfig.required}
              value={formData.birthday}
              onChange={(nextDate) => {
                setFormData((prev) => ({ ...prev, birthday: nextDate }));
                setTouched((prev) => ({ ...prev, birthday: true }));
              }}
              maximumDate={new Date()}
              error={birthdayError}
            />
          </View>
        );
      case "gender":
      case "orientation":
      case "passions":
        return renderSelectionChips({
          options: currentStepConfig.options,
          selectedValue:
            currentStepConfig.id === "gender"
              ? formData.gender
              : currentStepConfig.id === "orientation"
                ? formData.orientation
                : formData.passions,
          onSelect: (selected) => {
            if (currentStepConfig.id === "gender") {
              setFormData((prev) => ({ ...prev, gender: selected }));
              return;
            }

            if (currentStepConfig.id === "orientation") {
              setFormData((prev) => ({ ...prev, orientation: selected }));
              return;
            }

            togglePassion(selected);
          },
          multiple: currentStepConfig.selectionMode === "multiple",
        });
      case "photos":
        return (
          <View style={styles.fieldBlock}>
            <View style={styles.photoGrid}>
              {formData.photos.map((photoUri, index) => {
                const hasPhoto = Boolean(photoUri);

                return (
                  <Pressable
                    key={`photo-slot-${index}`}
                    onPress={() => pickPhoto(index)}
                    style={[
                      styles.photoCard,
                      hasPhoto ? styles.photoCardFilled : null,
                    ]}
                  >
                    {hasPhoto ? (
                      <>
                        <Image
                          source={{ uri: photoUri }}
                          style={styles.photoPreview}
                          contentFit="cover"
                        />
                        <Pressable
                          onPress={() => removePhoto(index)}
                          style={styles.removePhotoButton}
                        >
                          <Icon
                            name="close"
                            size={16}
                            color={defaultTheme.white}
                          />
                        </Pressable>
                      </>
                    ) : (
                      <View style={styles.photoPlaceholder}>
                        <View style={styles.photoPlusIconWrap}>
                          <Icon
                            name="add"
                            size={22}
                            color={defaultTheme.primary}
                          />
                        </View>
                        <Text style={styles.photoPlaceholderTitle}>
                          {index === 0 ? "Main photo" : `Photo ${index + 1}`}
                        </Text>
                        <Text style={styles.photoPlaceholderText}>
                          Tap to upload
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.photoTipsCard}>
              <Text style={styles.photoTipsTitle}>Photo tips</Text>
              {currentStepConfig.helperPoints.map((point) => (
                <View key={point} style={styles.photoTipRow}>
                  <View style={styles.photoTipDot} />
                  <Text style={styles.photoTipText}>{point}</Text>
                </View>
              ))}
            </View>

            {photosError ? (
              <Text style={styles.submitErrorText}>{photosError}</Text>
            ) : null}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.wrapper}>
      <Header prefixTitle="Onboarding" />
      <KeyboardScreenLayout
        containerStyle={styles.keyboardLayout}
        keyboardVerticalOffset={72}
        contentContainerStyle={styles.keyboardContent}
        scrollContentContainerStyle={styles.keyboardScrollContent}
        footerContainerStyle={styles.keyboardFooter}
        footer={
          <>
            <ButtonComponent
              buttonText={
                isSubmitting
                  ? step === totalSteps - 1
                    ? onboardingConfig.cta.uploading
                    : onboardingConfig.cta.saving
                  : step === totalSteps - 1
                    ? onboardingConfig.cta.finish
                    : onboardingConfig.cta.continue
              }
              viewStyle={styles.continueButton}
              onPress={handleContinue}
              disabled={!isStepValid() || isSubmitting}
            />
            {submitState === "error" && submitError ? (
              <Text style={styles.submitErrorText}>{submitError}</Text>
            ) : null}
          </>
        }
      >
        <View style={styles.background}>
          <View style={styles.progressHeader}>
            <Text style={styles.stepText}>
              Step {step + 1} of {totalSteps}
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${progressPercent}%` }]}
              />
            </View>
          </View>

          <Animated.View
            key={step}
            entering={
              direction === "forward"
                ? SlideInRight.duration(260)
                : SlideInLeft.duration(260)
            }
            exiting={
              direction === "forward"
                ? SlideOutLeft.duration(220)
                : SlideOutRight.duration(220)
            }
            style={styles.container}
          >
            <View style={styles.cardTopRow}>
              {step !== 0 ? (
                <Pressable onPress={prevStep} style={styles.inlineBackBtn}>
                  <Icon
                    name="chevron-back"
                    size={22}
                    color={defaultTheme.darkText}
                  />
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
        </View>
      </KeyboardScreenLayout>

      {submitState === "success" ? (
        <Animated.View
          entering={FadeIn.duration(220)}
          exiting={FadeOut.duration(180)}
          style={styles.successOverlay}
        >
          <Animated.View
            entering={ZoomIn.duration(280)}
            style={styles.successCard}
          >
            <Icon
              name="checkmark-circle"
              size={74}
              color={defaultTheme.pinkPrimary}
            />
            <Text style={styles.successTitle}>
              {onboardingConfig.success.title}
            </Text>
            <Text style={styles.successSubtitle}>
              {onboardingConfig.success.subtitle}
            </Text>
          </Animated.View>
        </Animated.View>
      ) : null}
    </View>
  );
};
