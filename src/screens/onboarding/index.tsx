import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useMemo, useState } from "react";
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
import {
  getOnboardingOptions,
  uploadImageToCloudinary,
  useAddUserInfo,
} from "../../api/onboarding";
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
type SelectionStepId = "gender" | "orientation" | "passions";
type OnboardingOptionId = string | number;
type OnboardingOptionItem = {
  id: OnboardingOptionId;
  label: string;
};

const selectionStepIds: SelectionStepId[] = [
  "gender",
  "orientation",
  "passions",
];

const emptyRemoteOptions: Record<SelectionStepId, OnboardingOptionItem[]> = {
  gender: [],
  orientation: [],
  passions: [],
};

const getFallbackOptions = (stepId: SelectionStepId) => {
  const stepConfig = onboardingConfig.steps.find(
    (configStep) => configStep.id === stepId,
  );

  if (
    !stepConfig ||
    (stepConfig.id !== "gender" &&
      stepConfig.id !== "orientation" &&
      stepConfig.id !== "passions")
  ) {
    return [];
  }

  return stepConfig.options.map((option, index) => ({
    id: `fallback-${stepId}-${index}-${option}`,
    label: option,
  }));
};

const getNestedPayload = (payload: any) => {
  return payload?.data?.data || payload?.data || payload?.options || payload;
};

const getListFromPayload = (payload: any, keys: string[]) => {
  if (!payload || Array.isArray(payload)) {
    return [];
  }

  for (const key of keys) {
    if (Array.isArray(payload?.[key])) {
      return payload[key];
    }
  }

  return [];
};

const getOptionLabel = (option: any) => {
  if (typeof option === "string" || typeof option === "number") {
    return String(option).trim();
  }

  const labelValue =
    option?.label ||
    option?.name ||
    option?.title ||
    option?.value ||
    option?.gender ||
    option?.gender_name ||
    option?.genderName ||
    option?.orientation ||
    option?.orientation_name ||
    option?.orientationName ||
    option?.passion ||
    option?.passion_name ||
    option?.passionName ||
    option?.passions;

  return typeof labelValue === "string" || typeof labelValue === "number"
    ? String(labelValue).trim()
    : "";
};

const getOptionId = (
  option: any,
  fallbackLabel: string,
  index: number,
  stepId: SelectionStepId,
) => {
  const idValue =
    option?.id ??
    option?.option_id ??
    option?.value_id ??
    option?.gender_id ??
    option?.orientation_id ??
    option?.passion_id;

  return idValue !== undefined && idValue !== null
    ? idValue
    : `${stepId}-${index}-${fallbackLabel}`;
};

const normalizeOptionList = (list: any[], stepId: SelectionStepId) => {
  return list
    .map((option, index) => {
      const label = getOptionLabel(option);

      if (!label) {
        return null;
      }

      return {
        id: getOptionId(option, label, index, stepId),
        label,
      };
    })
    .filter(Boolean) as OnboardingOptionItem[];
};

const getGroupedOptionsFromArray = (
  payload: any[],
  stepId: SelectionStepId,
) => {
  return payload.filter((item) => {
    const groupValue = String(
      item?.type ||
        item?.category ||
        item?.group ||
        item?.option_type ||
        item?.optionType ||
        "",
    ).toLowerCase();

    if (stepId === "passions") {
      return groupValue.includes("passion");
    }

    return groupValue.includes(stepId);
  });
};

const normalizeOnboardingOptions = (payload: any) => {
  const nestedPayload = getNestedPayload(payload);
  const optionKeys: Record<SelectionStepId, string[]> = {
    gender: [
      "genders",
      "gender",
      "genderOptions",
      "gender_options",
      "genderList",
      "gender_list",
    ],
    orientation: [
      "orientations",
      "orientation",
      "orientationOptions",
      "orientation_options",
      "orientationList",
      "orientation_list",
    ],
    passions: [
      "passions",
      "passion",
      "passionOptions",
      "passion_options",
      "passionList",
      "passion_list",
    ],
  };

  return selectionStepIds.reduce(
    (acc, stepId) => {
      const rawList = Array.isArray(nestedPayload)
        ? getGroupedOptionsFromArray(nestedPayload, stepId)
        : getListFromPayload(nestedPayload, optionKeys[stepId]);

      acc[stepId] = normalizeOptionList(rawList, stepId);
      return acc;
    },
    { ...emptyRemoteOptions },
  );
};

export const Onboarding = () => {
  const styles = createStyleSheet();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [submitError, setSubmitError] = useState("");
  const [isOptionsLoading, setIsOptionsLoading] = useState(false);
  const [optionsError, setOptionsError] = useState("");
  const [remoteOptions, setRemoteOptions] =
    useState<Record<SelectionStepId, OnboardingOptionItem[]>>(
      emptyRemoteOptions,
    );
  const [touched, setTouched] = useState({
    name: false,
    bio: false,
    birthday: false,
    photos: false,
  });
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    birthday: new Date(),
    gender: [] as OnboardingOptionId[],
    orientation: [] as OnboardingOptionId[],
    passions: [] as OnboardingOptionId[],
    photos: ["", "", "", ""] as string[],
  });
  const selectionOptions = useMemo(
    () =>
      selectionStepIds.reduce(
        (acc, stepId) => {
          acc[stepId] =
            remoteOptions[stepId].length > 0
              ? remoteOptions[stepId]
              : isOptionsLoading
                ? []
                : getFallbackOptions(stepId);
          return acc;
        },
        { ...emptyRemoteOptions },
      ),
    [isOptionsLoading, remoteOptions],
  );

  useEffect(() => {
    let isMounted = true;

    setIsOptionsLoading(true);
    setOptionsError("");

    getOnboardingOptions()
      .then((res) => {
        if (!isMounted) {
          return;
        }

        setRemoteOptions(normalizeOnboardingOptions(res?.data));
      })
      .catch((error) => {
        console.error("Onboarding options fetch failed:", error);
        if (!isMounted) {
          return;
        }

        setOptionsError("Could not refresh options. Showing default choices.");
      })
      .finally(() => {
        if (isMounted) {
          setIsOptionsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
      case "bio":
        return getBioValidationError(formData.bio) === "";
      case "birthday":
        return getBirthdayValidationError(formData.birthday) === "";
      case "gender":
        return formData.gender.length > 0;
      case "orientation":
        return formData.orientation.length > 0;
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

  const getBioValidationError = (bioValue: string) => {
    if (!bioValue.trim()) {
      return onboardingConfig.validation.bioRequired;
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
  const bioError = touched.bio ? getBioValidationError(formData.bio) : "";
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
        gender: formData.gender,
        orientation: formData.orientation,
        passions: formData.passions,
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

      if (currentStepConfig?.id === "bio") {
        setTouched((prev) => ({ ...prev, bio: true }));
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

  const togglePassion = (passionId: OnboardingOptionId) => {
    setFormData((prev) => {
      const exists = prev.passions.includes(passionId);
      return {
        ...prev,
        passions: exists
          ? prev.passions.filter((item) => item !== passionId)
          : [...prev.passions, passionId],
      };
    });
  };

  const renderSelectionChips = ({
    options,
    selectedValue,
    onSelect,
    multiple = false,
  }: {
    options: OnboardingOptionItem[];
    selectedValue: OnboardingOptionId[];
    onSelect: (selected: OnboardingOptionItem) => void;
    multiple?: boolean;
  }) => {
    return (
      <View style={styles.fieldBlock}>
        {isOptionsLoading ? (
          <Text style={styles.optionsHelperText}>Loading latest options...</Text>
        ) : null}
        {optionsError ? (
          <Text style={styles.optionsErrorText}>{optionsError}</Text>
        ) : null}
        <View style={styles.chipContainer}>
          {options.map((option) => {
            const isSelected = multiple
              ? selectedValue.includes(option.id)
              : selectedValue[0] === option.id;

            return (
              <Chip
                key={`${option.id}-${option.label}`}
                chipStyle={
                  {
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                  } as object
                }
                label={option.label}
                onSelect={() => onSelect(option)}
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
      case "bio":
        return (
          <View style={styles.fieldBlock}>
            <TextInputComponent
              label={currentStepConfig.fieldLabel}
              required={currentStepConfig.required}
              placeholder={currentStepConfig.placeholder}
              placeholderTextColor={hexToRgbA(defaultTheme.black, 40)}
              value={formData.bio}
              error={bioError}
              textArea
              multiline
              numberOfLines={5}
              maxLength={currentStepConfig.maxLength}
              viewStyle={styles.bioInput}
              onChangeText={(value) =>
                setFormData((prev) => ({ ...prev, bio: value }))
              }
              onBlur={() => setTouched((prev) => ({ ...prev, bio: true }))}
            />
            <Text style={styles.characterCount}>
              {formData.bio.length}/{currentStepConfig.maxLength}
            </Text>
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
          options: selectionOptions[currentStepConfig.id],
          selectedValue:
            currentStepConfig.id === "gender"
              ? formData.gender
              : currentStepConfig.id === "orientation"
                ? formData.orientation
                : formData.passions,
          onSelect: (selected) => {
            if (currentStepConfig.id === "gender") {
              setFormData((prev) => ({ ...prev, gender: [selected.id] }));
              return;
            }

            if (currentStepConfig.id === "orientation") {
              setFormData((prev) => ({
                ...prev,
                orientation: [selected.id],
              }));
              return;
            }

            togglePassion(selected.id);
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
