import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { Platform } from "react-native";
import apiClient from "..";
import {
  cloudinaryApiKey,
  cloudinaryCloudName,
  cloudinaryUploadPreset,
} from "../../constants/api";

export const useAddUserInfo = (payload: object) => {
  return apiClient.post(`/add-user-info`, payload);
};

export const compressImageForUpload = async (uri: string) => {
  const compressedImage = await manipulateAsync(
    uri,
    [{ resize: { width: 1440 } }],
    {
      compress: 0.72,
      format: SaveFormat.JPEG,
    },
  );

  return compressedImage.uri;
};

export const uploadImageToCloudinary = async (uri: string) => {
  if (!cloudinaryCloudName || !cloudinaryUploadPreset) {
    throw new Error(
      "Cloudinary is not configured yet. Add your upload preset in src/constants/api.ts.",
    );
  }

  const compressedUri = await compressImageForUpload(uri);
  const formData = new FormData();
  const fileName = `bae2b-${Date.now()}.jpg`;

  if (Platform.OS === "web") {
    const fileResponse = await fetch(compressedUri);
    const fileBlob = await fileResponse.blob();
    formData.append("file", fileBlob, fileName);
  } else {
    formData.append("file", {
      uri: compressedUri,
      name: fileName,
      type: "image/jpeg",
    } as any);
  }
  formData.append("upload_preset", cloudinaryUploadPreset);
  if (cloudinaryApiKey) {
    formData.append("api_key", cloudinaryApiKey);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await response.json();
  if (!response.ok || !data?.secure_url) {
    throw new Error(data?.error?.message || "Image upload failed.");
  }

  return data.secure_url as string;
};
