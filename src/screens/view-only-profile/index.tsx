import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import Icon from "react-native-vector-icons/Ionicons";
import { useMatchedUserData } from "../../api/match";
import { Header } from "../../components/Header";
import Loader from "../../components/Loader";
import { hexToRgbA } from "../../utils/hexToRgba";
import { createStyleSheet } from "./style";

type ProfileSection = {
  type?: "BIG_TEXT" | "SMALL_TEXT" | "SMALL_TEXT_LIST";
  title?: string;
  content?: string | Array<{ value?: string } | string>;
};

const FALLBACK_PROFILE_IMAGE =
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e";
const MIN_HERO_HEIGHT = 320;

const getMatchedPayload = (rawData: unknown) => {
  if (!rawData || Array.isArray(rawData)) {
    return undefined;
  }

  const payload = rawData as Record<string, unknown>;
  return (
    (payload.user as Record<string, unknown> | undefined) ||
    (payload.matched_user as Record<string, unknown> | undefined) ||
    (payload.matchedUser as Record<string, unknown> | undefined) ||
    payload
  );
};

const getStringValue = (value: unknown) => {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number") {
    return String(value);
  }

  return "";
};

const getProfileSections = (rawData: unknown): ProfileSection[] => {
  if (Array.isArray(rawData)) {
    return rawData as ProfileSection[];
  }

  const payload = getMatchedPayload(rawData);
  if (Array.isArray(payload?.segregatedList)) {
    return payload.segregatedList as ProfileSection[];
  }

  if (Array.isArray(payload?.segregated_list)) {
    return payload.segregated_list as ProfileSection[];
  }

  return [];
};

const getStringContent = (content: ProfileSection["content"]) => {
  return typeof content === "string" ? content : "";
};

const getListItems = (content: ProfileSection["content"]) => {
  if (!Array.isArray(content)) {
    return [];
  }

  return content
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      return item?.value?.trim() || "";
    })
    .filter(Boolean);
};

const calculateAge = (birthday?: string) => {
  if (!birthday) {
    return "";
  }

  const birthDate = new Date(birthday);
  if (Number.isNaN(birthDate.getTime())) {
    return "";
  }

  const todayDate = new Date();
  let age = todayDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = todayDate.getMonth() - birthDate.getMonth();
  const dayDiff = todayDate.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age > 0 ? String(age) : "";
};

const getProfileImages = (rawData: unknown) => {
  const payload = getMatchedPayload(rawData);
  const imageCandidates = [
    ...(Array.isArray(payload?.images) ? payload.images : []),
    ...(Array.isArray(payload?.photos) ? payload.photos : []),
    payload?.profileImage,
    payload?.profile_image,
    payload?.imageUrl,
  ];

  return imageCandidates.filter(
    (imageUri, index, self) =>
      typeof imageUri === "string" &&
      imageUri.trim().length > 0 &&
      self.indexOf(imageUri) === index,
  ) as string[];
};

export const ViewOnlyProfile = () => {
  const styles = createStyleSheet();
  const { height: windowHeight } = useWindowDimensions();
  const [rawProfileData, setRawProfileData] = useState<unknown>();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const payload = useMemo(() => getMatchedPayload(rawProfileData), [rawProfileData]);
  const profileData = useMemo(
    () => getProfileSections(rawProfileData),
    [rawProfileData],
  );
  const profileImages = useMemo(
    () => getProfileImages(rawProfileData),
    [rawProfileData],
  );

  const activeImageUri =
    profileImages[currentPhotoIndex] ||
    profileImages[0] ||
    FALLBACK_PROFILE_IMAGE;
  const heroHeight = Math.max(MIN_HERO_HEIGHT, Math.round(windowHeight * 0.67));
  const headlineSection = profileData.find(
    (section) => section?.type === "BIG_TEXT",
  );
  const name = getStringValue(payload?.name);
  const age =
    getStringValue(payload?.age) || calculateAge(getStringValue(payload?.birthday));
  const headline =
    getStringContent(headlineSection?.content) ||
    `${name || "Profile"}${age ? `, ${age}` : ""}`;
  const location = getStringValue(payload?.location);
  const bio = getStringValue(payload?.bio);
  const sectionsToRender = profileData.filter(
    (section) =>
      section?.type !== "BIG_TEXT" &&
      (getStringContent(section?.content).trim().length > 0 ||
        getListItems(section?.content).length > 0),
  );

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setFetchError("");

    useMatchedUserData()
      .then((res) => {
        if (!isMounted) {
          return;
        }

        setRawProfileData(res?.data);
        setCurrentPhotoIndex(0);
      })
      .catch((error) => {
        console.error("View profile fetch failed:", error);
        if (!isMounted) {
          return;
        }

        setRawProfileData(undefined);
        setCurrentPhotoIndex(0);
        setFetchError("Could not load profile details.");
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const showPreviousPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const showNextPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev < profileImages.length - 1 ? prev + 1 : prev,
    );
  };

  const renderHero = () => {
    return (
      <Animated.View entering={FadeIn.duration(260)} style={styles.heroCard}>
        <Animated.Image
          source={{ uri: activeImageUri }}
          style={[styles.heroImage, { height: heroHeight }]}
        />

        {profileImages.length > 1 ? (
          <View style={styles.imageProgressRow}>
            {profileImages.map((imageUri, index) => (
              <View
                key={`${imageUri}-${index}`}
                style={[
                  styles.imageProgressBar,
                  index === currentPhotoIndex
                    ? styles.imageProgressBarActive
                    : null,
                ]}
              />
            ))}
          </View>
        ) : null}

        <View style={styles.imageTapOverlay}>
          <Pressable onPress={showPreviousPhoto} style={styles.imageTapZone} />
          <Pressable onPress={showNextPhoto} style={styles.imageTapZone} />
        </View>

        <LinearGradient
          colors={[
            hexToRgbA("#000000", 90),
            hexToRgbA("#000000", 72),
            hexToRgbA("#000000", 30),
            "transparent",
          ]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          pointerEvents="box-none"
          style={styles.heroOverlay}
        >
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroName}>{headline}</Text>
            {location ? <Text style={styles.heroMeta}>{location}</Text> : null}
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderBio = () => {
    if (!bio) {
      return null;
    }

    return (
      <Animated.View entering={FadeIn.delay(80).duration(280)} style={styles.bioCard}>
        <View style={styles.bioIconBubble}>
          <Icon name="chatbubble-ellipses-outline" size={18} color="#111111" />
        </View>
        <View style={styles.bioContent}>
          <Text style={styles.bioLabel}>Bio</Text>
          <Text style={styles.bioText}>{bio}</Text>
        </View>
      </Animated.View>
    );
  };

  const renderSection = (section: ProfileSection, index: number) => {
    const title = section?.title || "About";

    if (section?.type === "SMALL_TEXT_LIST") {
      const items = getListItems(section.content);

      return (
        <Animated.View
          key={`${title}-${index}`}
          entering={FadeIn.delay(index * 70).duration(280)}
          style={styles.promptCard}
        >
          <Text style={styles.promptLabel}>{title}</Text>
          <View style={styles.chipRow}>
            {items.map((item) => (
              <View key={item} style={styles.chip}>
                <Text style={styles.chipText}>{item}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      );
    }

    return (
      <Animated.View
        key={`${title}-${index}`}
        entering={FadeIn.delay(index * 70).duration(280)}
        style={styles.promptCard}
      >
        <Text style={styles.promptLabel}>{title}</Text>
        <Text style={styles.promptText}>{getStringContent(section.content)}</Text>
      </Animated.View>
    );
  };

  return (
    <View style={styles.screen}>
      <Loader visible={isLoading} />
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.profileContent}
      >
        {renderHero()}
        {renderBio()}

        {sectionsToRender.length > 0 ? (
          sectionsToRender.map(renderSection)
        ) : (
          <Animated.View entering={FadeIn.duration(280)} style={styles.promptCard}>
            <Text style={styles.promptLabel}>Profile</Text>
            <Text style={styles.promptText}>
              {fetchError || "This person has not added more details yet."}
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};
