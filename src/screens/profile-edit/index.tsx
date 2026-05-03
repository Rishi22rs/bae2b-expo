import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { uploadImageToCloudinary } from "../../api/onboarding";
import {
  extractUserInfoData,
  useGetUserInfo,
  useUpdateUserInfo,
} from "../../api/profile";
import { ButtonComponent } from "../../components/ButtonComponent";
import { DatePickerField } from "../../components/DatePickerField";
import { Header } from "../../components/Header";
import { KeyboardScreenLayout } from "../../components/KeyboardScreenLayout";
import { TextInputComponent } from "../../components/TextInputComponent";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { createStyleSheet } from "./style";

type ProfileFormState = {
  name: string;
  phone_number: string;
  bio: string;
  birthday: Date | string | null;
  photos: string[];
};

const normalizePhotoList = (user: Record<string, any>) =>
  [
    ...(Array.isArray(user?.images) ? user.images : []),
    ...(Array.isArray(user?.photos) ? user.photos : []),
    user?.profileImage || user?.profile_image || user?.imageUrl || "",
  ]
    .filter(
      (imageUri, index, self) =>
        typeof imageUri === "string" &&
        imageUri.trim().length > 0 &&
        self.indexOf(imageUri) === index,
    )
    .slice(0, 4);

export const ProfileEdit = () => {
  const styles = createStyleSheet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialUser, setInitialUser] = useState<Record<string, any>>({});
  const [initialRemotePhotos, setInitialRemotePhotos] = useState<string[]>([]);
  const [formData, setFormData] = useState<ProfileFormState>({
    name: "",
    phone_number: "",
    bio: "",
    birthday: null,
    photos: ["", "", "", ""],
  });

  useEffect(() => {
    let isMounted = true;

    useGetUserInfo()
      .then((res) => {
        if (!isMounted) {
          return;
        }

        const user = extractUserInfoData(res);
        const normalizedPhotos = normalizePhotoList(user);
        setInitialUser(user);
        setInitialRemotePhotos(normalizedPhotos);
        setFormData({
          name: user?.name || "",
          phone_number: user?.phone_number || "",
          bio: user?.bio || "",
          birthday: user?.birthday || null,
          photos: normalizedPhotos.concat(["", "", "", ""]).slice(0, 4),
        });
      })
      .catch((error) => {
        console.error("Failed to load profile info", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const hasLocalUri = (uri: string) =>
    Boolean(uri) &&
    !uri.startsWith("http://") &&
    !uri.startsWith("https://") &&
    !uri.startsWith("data:");

  const handleUpdateProfile = async () => {
    if (isSubmitting) {
      return;
    }

    if (!formData.name.trim()) {
      showErrorToast("Please enter your name.", {
        title: "Name required",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const uploadedPhotos = await Promise.all(
        formData.photos.map(async (photoUri) => {
          if (!photoUri) {
            return "";
          }

          if (!hasLocalUri(photoUri)) {
            return photoUri;
          }

          return uploadImageToCloudinary(photoUri);
        }),
      );

      const finalPhotos = uploadedPhotos.filter(
        (photoUri) =>
          typeof photoUri === "string" && photoUri.trim().length > 0,
      );

      const imagesToAdd = finalPhotos.filter(
        (photoUri) => !initialRemotePhotos.includes(photoUri),
      );
      const imagesToRemove = initialRemotePhotos.filter(
        (photoUri) => !finalPhotos.includes(photoUri),
      );

      const payload: Record<string, any> = {};

      if (formData.name.trim() !== (initialUser?.name || "")) {
        payload.name = formData.name.trim();
      }

      if ((formData.bio || "") !== (initialUser?.bio || "")) {
        payload.bio = formData.bio.trim();
      }

      const initialBirthday = initialUser?.birthday || null;
      if ((formData.birthday || null) !== initialBirthday) {
        payload.birthday = formData.birthday;
      }

      if (imagesToAdd.length > 0) {
        payload.images_to_add = imagesToAdd;
      }

      if (imagesToRemove.length > 0) {
        payload.images_to_remove = imagesToRemove;
      }

      if (Object.keys(payload).length === 0) {
        showErrorToast("Make a change before updating your profile.", {
          title: "No changes found",
        });
        setIsSubmitting(false);
        return;
      }

      await useUpdateUserInfo(payload);

      setInitialUser((prev) => ({
        ...prev,
        name: formData.name.trim(),
        bio: formData.bio.trim(),
        birthday: formData.birthday,
        images: finalPhotos,
      }));
      setInitialRemotePhotos(finalPhotos);
      setFormData((prev) => ({
        ...prev,
        photos: finalPhotos.concat(["", "", "", ""]).slice(0, 4),
      }));

      showSuccessToast("Your profile has been updated.", {
        title: "Profile saved",
      });
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to update your profile right now.",
        {
          title: "Update failed",
          duration: 3200,
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const pickPhoto = async (index: number) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showErrorToast("Please allow photo access to update your images.", {
        title: "Permission needed",
      });
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
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => {
      const nextPhotos = [...prev.photos];
      nextPhotos[index] = "";
      return { ...prev, photos: nextPhotos };
    });
  };

  return (
    <>
      <View style={styles.screen}>
        <Header />
        <KeyboardScreenLayout
          containerStyle={styles.keyboardLayout}
          keyboardVerticalOffset={72}
          contentContainerStyle={styles.content}
          footerContainerStyle={styles.footer}
          scrollContentContainerStyle={styles.scrollContentContainer}
          footer={
            <ButtonComponent
              buttonText="Update"
              viewStyle={styles.updateButton}
              onPress={handleUpdateProfile}
              isLoading={isSubmitting}
              loadingText="Updating..."
              disabled={isSubmitting}
            />
          }
        >
          <View style={styles.formSection}>
            <View style={styles.photosHeader}>
              <Text style={styles.photosTitle}>Your photos</Text>
              <Text style={styles.photosSubtitle}>
                Add up to 4 photos. Your first one should be your clearest shot.
              </Text>
            </View>

            <View style={styles.photoGrid}>
              {formData.photos.map((photoUri, index) => {
                const hasPhoto = Boolean(photoUri);

                return (
                  <Pressable
                    key={`profile-photo-slot-${index}`}
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
                          <Text style={styles.removePhotoButtonText}>x</Text>
                        </Pressable>
                      </>
                    ) : (
                      <View style={styles.photoPlaceholder}>
                        <View style={styles.photoPlusIconWrap}>
                          <Text style={styles.photoPlusIcon}>+</Text>
                        </View>
                        <Text style={styles.photoPlaceholderTitle}>
                          {index === 0 ? "Main photo" : `Photo ${index + 1}`}
                        </Text>
                        <Text style={styles.photoPlaceholderText}>
                          Tap to add image
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.formSection}>
            <TextInputComponent
              label="Name"
              placeholder="Enter your name"
              value={formData.name}
              onChangeText={(value) =>
                setFormData((prev) => ({ ...prev, name: value }))
              }
            />

            <TextInputComponent
              label="Phone Number"
              placeholder="Enter your phone number"
              value={formData.phone_number}
              onChangeText={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  phone_number: value.replace(/[^\d]/g, "").slice(0, 10),
                }))
              }
              keyboardType="phone-pad"
              autoComplete="tel"
              disabled
            />

            <TextInputComponent
              label="Bio"
              placeholder="Tell people about yourself"
              value={formData.bio}
              onChangeText={(value) =>
                setFormData((prev) => ({ ...prev, bio: value }))
              }
              textArea
              multiline
              numberOfLines={4}
            />

            <DatePickerField
              label="Birthday"
              value={formData.birthday}
              maximumDate={new Date()}
              placeholder="Select your birthday"
              disabled
            />
          </View>
        </KeyboardScreenLayout>
      </View>
    </>
  );
};
