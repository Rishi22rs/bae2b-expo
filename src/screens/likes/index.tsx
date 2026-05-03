import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useGetLikesReceived } from "../../api/match";
import { Header } from "../../components/Header";
import {
  LikedUserCard,
  LikedUserCardProps,
} from "../../components/LikedUserCard/index";
import Loader from "../../components/Loader";
import { TwoColumnCardGrid } from "../../components/TwoColumnCardGrid/index";
import { navigationConstants } from "../../constants/app-navigation";
import { createStyleSheet } from "./style";

interface ProfileListItem {
  value?: string;
}

export interface ProfileSection {
  type: "BIG_TEXT" | "SMALL_TEXT" | "SMALL_TEXT_LIST";
  title: string;
  content: string | Array<ProfileListItem | string>;
}

export interface LikedUserItem extends LikedUserCardProps {
  id: string;
  userId?: string;
  orientation?: string;
  gender?: string;
  profileImage?: string;
  profile_image?: string;
  images?: string[];
  photos?: string[];
  segregatedList?: ProfileSection[];
}

interface LikesScreenProps {
  route?: {
    params?: {
      users?: LikedUserItem[];
      title?: string;
      subtitle?: string;
    };
  };
}

const parseNameAgeFromHeadline = (headline?: string) => {
  if (!headline) {
    return {};
  }

  const [namePart, agePart] = headline.split(",").map((part) => part?.trim());
  const parsedAge = Number(agePart);

  return {
    name: namePart || undefined,
    age: Number.isNaN(parsedAge) ? undefined : parsedAge,
  };
};

const getAgeFromBirthday = (birthday?: string) => {
  if (!birthday) {
    return undefined;
  }

  const birthDate = new Date(birthday);
  if (Number.isNaN(birthDate.getTime())) {
    return undefined;
  }

  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();
  const dayDiff = now.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age >= 0 ? age : undefined;
};

const parseAgeValue = (value: unknown) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) {
    return undefined;
  }

  return parsed;
};

const toSectionListItems = (value: unknown): ProfileListItem[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return { value: item };
      }

      if (item && typeof item === "object" && "value" in item) {
        return { value: (item as { value?: string })?.value || "" };
      }

      return null;
    })
    .filter((item): item is ProfileListItem => Boolean(item?.value));
};

const buildSegregatedList = (user: LikedUserItem) => {
  if (Array.isArray(user?.segregatedList) && user?.segregatedList?.length > 0) {
    return user.segregatedList;
  }

  const sections: ProfileSection[] = [];
  const headline = `${user?.name || "Profile"}${
    typeof user?.age === "number" ? `, ${user.age}` : ""
  }`;
  sections.push({ type: "BIG_TEXT", title: "About Me", content: headline });

  if (user?.location) {
    sections.push({
      type: "SMALL_TEXT",
      title: "Location",
      content: user.location,
    });
  }

  return sections;
};

const normalizeLikesResponseItem = (
  item: Record<string, unknown>,
  index: number,
): LikedUserItem => {
  const nestedUser =
    (item?.liked_user as Record<string, unknown>) ||
    (item?.likedUser as Record<string, unknown>) ||
    (item?.sender_user as Record<string, unknown>) ||
    (item?.senderUser as Record<string, unknown>) ||
    (item?.user as Record<string, unknown>) ||
    (item?.other_user as Record<string, unknown>) ||
    (item?.otherUser as Record<string, unknown>) ||
    item;

  const possibleList =
    (nestedUser?.segregatedList as ProfileSection[]) ||
    (nestedUser?.segregated_list as ProfileSection[]) ||
    (item?.segregatedList as ProfileSection[]) ||
    (item?.segregated_list as ProfileSection[]);

  const composedName = `${(nestedUser?.first_name as string) || ""} ${
    (nestedUser?.last_name as string) || ""
  }`.trim();
  const fullName =
    (nestedUser?.name as string) ||
    (nestedUser?.full_name as string) ||
    composedName;
  const age =
    parseAgeValue(nestedUser?.age) ??
    parseAgeValue(nestedUser?.user_age) ??
    parseAgeValue(nestedUser?.profileAge) ??
    getAgeFromBirthday(nestedUser?.birthday as string);

  const interestsFromInterests = toSectionListItems(nestedUser?.interests);
  const interestsFromHobbies = toSectionListItems(nestedUser?.hobbies);
  const interestsFromPassions = String((nestedUser?.passions as string) || "")
    .split(",")
    .map((item) => item?.trim())
    .filter(Boolean)
    .map((value) => ({ value }));
  const interests =
    interestsFromInterests?.length > 0
      ? interestsFromInterests
      : interestsFromHobbies?.length > 0
        ? interestsFromHobbies
        : interestsFromPassions;

  const candidateUser: LikedUserItem = {
    id: String(
      (item?.id as string | number) ||
        (item?._id as string | number) ||
        (nestedUser?.id as string | number) ||
        (nestedUser?._id as string | number) ||
        (nestedUser?.userId as string | number) ||
        `liked-user-${index}`,
    ),
    userId:
      (nestedUser?.userId as string) ||
      (nestedUser?._id as string) ||
      (nestedUser?.id as string),
    name: fullName,
    age,
    orientation:
      (nestedUser?.orientation as string) ||
      (nestedUser?.sexual_orientation as string),
    gender: nestedUser?.gender as string,
    location:
      (nestedUser?.location as string) ||
      (nestedUser?.city as string) ||
      (nestedUser?.currentCity as string),
    imageUrl:
      (nestedUser?.imageUrl as string) ||
      (nestedUser?.profileImage as string) ||
      (nestedUser?.profile_image as string) ||
      (Array.isArray(nestedUser?.images)
        ? (nestedUser.images?.[0] as string)
        : undefined) ||
      (Array.isArray(nestedUser?.photos)
        ? (nestedUser.photos?.[0] as string)
        : undefined),
    profileImage: nestedUser?.profileImage as string,
    profile_image: nestedUser?.profile_image as string,
    images: Array.isArray(nestedUser?.images)
      ? (nestedUser.images as string[])
      : undefined,
    photos: Array.isArray(nestedUser?.photos)
      ? (nestedUser.photos as string[])
      : undefined,
    badgeText: "Liked You",
    segregatedList: Array.isArray(possibleList) ? possibleList : undefined,
  };

  if (!candidateUser?.segregatedList?.length) {
    const autoSections = buildSegregatedList(candidateUser);

    if ((candidateUser?.gender || "").trim()) {
      autoSections.push({
        type: "SMALL_TEXT",
        title: "Gender",
        content: candidateUser.gender || "",
      });
    }

    if ((candidateUser?.orientation || "").trim()) {
      autoSections.push({
        type: "SMALL_TEXT",
        title: "Orientation",
        content: candidateUser.orientation || "",
      });
    }

    if ((nestedUser?.bio as string)?.trim()) {
      autoSections.push({
        type: "SMALL_TEXT",
        title: "Bio",
        content: (nestedUser?.bio as string).trim(),
      });
    }

    if (interests?.length) {
      autoSections.push({
        type: "SMALL_TEXT_LIST",
        title: "Interests",
        content: interests,
      });
    }

    candidateUser.segregatedList = autoSections;
  }

  return candidateUser;
};

const resolveCardDisplayData = (item: LikedUserItem) => {
  const headline = item?.segregatedList?.find(
    (section) => section?.type === "BIG_TEXT",
  )?.content;
  const parsed = parseNameAgeFromHeadline(
    typeof headline === "string" ? headline : undefined,
  );

  const locationSection = item?.segregatedList?.find(
    (section) =>
      section?.type === "SMALL_TEXT" &&
      section?.title?.toLowerCase()?.includes("location"),
  );

  const resolvedLocation =
    item?.location ||
    (typeof locationSection?.content === "string"
      ? locationSection.content
      : undefined);

  return {
    name: item?.name || parsed?.name,
    age: item?.age ?? parsed?.age,
    location: resolvedLocation,
    imageUrl:
      item?.imageUrl ||
      item?.profileImage ||
      item?.profile_image ||
      item?.images?.[0] ||
      item?.photos?.[0],
    badgeText: item?.badgeText,
  };
};

export const Likes = ({ route }: LikesScreenProps) => {
  const styles = createStyleSheet();
  const navigation = useNavigation();
  const routeUsers = route?.params?.users || [];
  const hasRouteUsers = routeUsers?.length > 0;
  const [users, setUsers] = useState<LikedUserItem[]>(routeUsers);
  const [isLoading, setIsLoading] = useState<boolean>(!hasRouteUsers);
  const [fetchError, setFetchError] = useState<string>("");
  const title = route?.params?.title ?? "Liked You";
  const subtitle =
    route?.params?.subtitle ?? "People who showed interest in your profile.";

  const fetchLikesUsers = useCallback(async () => {
    if (hasRouteUsers) {
      return;
    }

    setIsLoading(true);
    setFetchError("");
    try {
      const response = await useGetLikesReceived();
      const responseData = response?.data;
      console.log("responseData?.users", responseData?.users);
      const likesList = responseData?.users;
      console.log({ likesList });
      // const normalized = likesList.map((item, index) =>
      //   normalizeLikesResponseItem(item as Record<string, unknown>, index),
      // );
      console.log({ likesList });
      setUsers(likesList);
    } catch (error) {
      console.error("getLikesReceived error:", error);
      setUsers([]);
      setFetchError("rUnable to load likes right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [hasRouteUsers]);

  useEffect(() => {
    fetchLikesUsers();
  }, [fetchLikesUsers]);
  console.log({ fetchError });
  return (
    <View style={styles.container}>
      <Header prefixTitle="People Who" title={title} />
      <View style={styles.body}>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {fetchError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{fetchError}</Text>
            <Pressable onPress={fetchLikesUsers} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        ) : null}
        {isLoading ? (
          <View style={styles.loaderWrapper}>
            <Loader visible />
          </View>
        ) : (
          <TwoColumnCardGrid
            data={users}
            keyExtractor={(item) => item.id}
            emptyMessage="No likes yet. Check back soon."
            renderCard={(item) => {
              const displayData = resolveCardDisplayData(item);

              return (
                <LikedUserCard
                  name={displayData.name}
                  age={displayData.age}
                  location={displayData.location}
                  imageUrl={displayData.imageUrl}
                  badgeText={displayData.badgeText}
                  onPress={
                    item.onPress ||
                    (() => {
                      const { onPress: _ignoreOnPress, ...userForProfile } =
                        item;
                      navigation.navigate(navigationConstants.LIKES_PROFILE, {
                        user: userForProfile,
                      });
                    })
                  }
                />
              );
            }}
          />
        )}
      </View>
    </View>
  );
};
