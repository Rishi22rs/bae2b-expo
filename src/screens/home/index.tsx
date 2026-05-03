import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideInUp,
  SlideOutDown,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/Ionicons";
import {
  useAddLikeDislike,
  useGetNearbyUsers,
  useUpdateUserLocation,
} from "../../api/match";
import {
  BottomSheetComponent,
  BottomSheetHandle,
} from "../../components/BottomSheetComponent";
import { ButtonComponent } from "../../components/ButtonComponent";
import { Header } from "../../components/Header";
import Loader from "../../components/Loader";
import { navigationConstants } from "../../constants/app-navigation";
import { hexToRgbA } from "../../utils/hexToRgba";
import { requestLocationPermission } from "../../utils/requestLocationPermission";
import { createStyleSheet } from "./style";

type ProfileSection = {
  type: "BIG_TEXT" | "SMALL_TEXT" | "SMALL_TEXT_LIST";
  title?: string;
  content?: string | Array<{ value?: string } | string>;
};

type NearbyUser = {
  id?: string;
  userId?: string;
  name?: string;
  bio?: string;
  age?: number;
  location?: string;
  imageUrl?: string;
  profileImage?: string;
  profile_image?: string;
  images?: string[];
  photos?: string[];
  segregatedList?: ProfileSection[];
};

type Coords = {
  latitude: number;
  longitude: number;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e";
const MIN_HERO_HEIGHT = 320;

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

const getUserImages = (user?: NearbyUser) => {
  const imageCandidates = [
    ...(Array.isArray(user?.images) ? user.images : []),
    ...(Array.isArray(user?.photos) ? user.photos : []),
    user?.profileImage,
    user?.profile_image,
    user?.imageUrl,
  ];

  return imageCandidates.filter(
    (imageUri, index, self) =>
      typeof imageUri === "string" &&
      imageUri.trim().length > 0 &&
      self.indexOf(imageUri) === index,
  ) as string[];
};

export const Home = () => {
  const styles = createStyleSheet();
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const { height: windowHeight } = useWindowDimensions();
  const swipeLimitSheetRef = useRef<BottomSheetHandle>(null);

  const [locationGranted, setLocationGranted] = useState(false);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [coords, setCoords] = useState<Coords | undefined>();
  const [showLoader, setShowLoader] = useState(true);
  const [reactionPreview, setReactionPreview] = useState<0 | -1 | 1>(0);
  const [swipeLimitMessage, setSwipeLimitMessage] = useState(
    "You are out of swipes for now. Come back a little later.",
  );

  const isInsecureWebContext =
    Platform.OS === "web" &&
    typeof window !== "undefined" &&
    !window.isSecureContext;

  const currentUser = nearbyUsers[currentUserIndex];
  const currentUserImages = useMemo(
    () => getUserImages(currentUser),
    [currentUser],
  );
  const activeImageUri =
    currentUserImages[currentPhotoIndex] ||
    currentUserImages[0] ||
    FALLBACK_IMAGE;

  const headlineSection = currentUser?.segregatedList?.find(
    (section) => section?.type === "BIG_TEXT",
  );
  const headline =
    getStringContent(headlineSection?.content) ||
    `${currentUser?.name || "Someone new"}${
      currentUser?.age ? `, ${currentUser.age}` : ""
    }`;
  const sectionsToRender =
    currentUser?.segregatedList?.filter(
      (section) =>
        section?.type !== "BIG_TEXT" &&
        (getStringContent(section?.content).trim().length > 0 ||
          getListItems(section?.content).length > 0),
    ) || [];
  const currentUserBio =
    typeof currentUser?.bio === "string" ? currentUser.bio.trim() : "";

  const bottomTabSpace = Math.max(tabBarHeight - 30, 34);
  const stickyActionBottom = bottomTabSpace;
  const heroHeight = Math.max(MIN_HERO_HEIGHT, Math.round(windowHeight * 0.67));
  const profileBottomPadding = stickyActionBottom + 96;

  const getNearyByUsers = () => {
    if (!coords) {
      return;
    }

    setShowLoader(true);
    useGetNearbyUsers({
      latitude: coords.latitude,
      longitude: coords.longitude,
      radius: 1000000,
    })
      .then((res) => {
        setNearbyUsers(Array.isArray(res?.data) ? res.data : []);
        setCurrentUserIndex(0);
      })
      .catch((error) => {
        console.error("Nearby users fetch error:", error);
        setNearbyUsers([]);
      })
      .finally(() => {
        setShowLoader(false);
      });
  };

  useEffect(() => {
    getNearyByUsers();
  }, [coords]);

  useEffect(() => {
    setCurrentPhotoIndex(0);
  }, [currentUserIndex]);

  const askLocationPermission = async () => {
    setShowLoader(true);
    const granted = await requestLocationPermission();
    setLocationGranted(granted);
    if (!granted) {
      setShowLoader(false);
    }
  };

  useEffect(() => {
    const initializePermission = async () => {
      try {
        const existingPermission =
          await Location.getForegroundPermissionsAsync();

        if (existingPermission.status === "granted") {
          setLocationGranted(true);
          return;
        }

        if (Platform.OS !== "web") {
          await askLocationPermission();
          return;
        }

        setLocationGranted(false);
        setShowLoader(false);
      } catch (error) {
        console.error("Permission check error:", error);
        setLocationGranted(false);
        setShowLoader(false);
      }
    };

    initializePermission();
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const updateLocation = async () => {
        if (!locationGranted) {
          setShowLoader(false);
          return;
        }

        setShowLoader(true);
        try {
          const position = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
          });

          if (!isActive) {
            return;
          }

          const currentCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          setCoords(currentCoords);
          useUpdateUserLocation(currentCoords).catch((error) =>
            console.error("Location update error:", error),
          );
        } catch (error) {
          console.error("Location error:", error);
          setShowLoader(false);
        }
      };

      updateLocation();

      return () => {
        isActive = false;
      };
    }, [locationGranted]),
  );

  const showPreviousPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const showNextPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev < currentUserImages.length - 1 ? prev + 1 : prev,
    );
  };

  const openSwipeLimitSheet = (message?: string) => {
    setSwipeLimitMessage(
      message || "You are out of swipes for now. Come back a little later.",
    );
    swipeLimitSheetRef.current?.open();
  };

  const handleReaction = (like: -1 | 1) => {
    if (!currentUser) {
      return;
    }

    setReactionPreview(like);
    setTimeout(() => setReactionPreview(0), 700);

    useAddLikeDislike({
      other_user_id: currentUser.userId || currentUser.id,
      is_like: like === 1 ? 1 : 0,
    })
      .then((res) => {
        if (res?.data?.matched) {
          (navigation as any).replace(navigationConstants.MATCH_ROUTE, {
            screen: navigationConstants.ITS_A_MATCH,
            params: {
              secondImageUrl: activeImageUri,
            },
          });
          return;
        }

        setTimeout(() => {
          setCurrentUserIndex((prev) => prev + 1);
        }, 180);
      })
      .catch((error) => {
        const statusCode = error?.response?.status;
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "";

        if (
          statusCode === 402 ||
          statusCode === 403 ||
          statusCode === 429 ||
          /no\s*likes\s*left|no\s*swipes\s*left|out\s*of\s*swipes|limit/i.test(
            message,
          )
        ) {
          openSwipeLimitSheet(message);
          return;
        }

        console.error("Like/dislike error:", error?.response || error);
      });
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
        <Text style={styles.promptText}>
          {getStringContent(section.content)}
        </Text>
      </Animated.View>
    );
  };

  const renderBio = () => {
    if (!currentUserBio) {
      return null;
    }

    return (
      <Animated.View entering={FadeIn.delay(80).duration(280)} style={styles.bioCard}>
        <View style={styles.bioIconBubble}>
          <Icon name="chatbubble-ellipses-outline" size={18} color="#111111" />
        </View>
        <View style={styles.bioContent}>
          <Text style={styles.bioLabel}>Bio</Text>
          <Text style={styles.bioText}>{currentUserBio}</Text>
        </View>
      </Animated.View>
    );
  };

  const renderHero = () => {
    return (
      <Animated.View entering={FadeIn.duration(260)} style={styles.heroCard}>
        <Animated.Image
          source={{ uri: activeImageUri }}
          style={[styles.heroImage, { height: heroHeight }]}
        />

        {currentUserImages.length > 1 ? (
          <View style={styles.imageProgressRow}>
            {currentUserImages.map((imageUri, index) => (
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
          style={styles.heroOverlay}
          pointerEvents="box-none"
        >
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroName}>{headline}</Text>
            {currentUser?.location ? (
              <Text style={styles.heroMeta}>{currentUser.location}</Text>
            ) : null}
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderNoUserNearby = () => {
    return (
      <View style={[styles.noNearbyScreen, { minHeight: windowHeight - 140 }]}>
        <View style={styles.noNearbyBadge}>
          <Icon name="sparkles-outline" size={24} color="#111111" />
        </View>
        <Text style={styles.noNearbyText}>No one new around you yet.</Text>
      </View>
    );
  };

  const renderPermissionView = () => {
    return (
      <View style={styles.permissionScreen}>
        <Icon name="navigate-outline" size={26} color="#111111" />
        <Text style={styles.permissionTitle}>Turn on location.</Text>
        <Text style={styles.permissionText}>
          We need your location to show people near you.
        </Text>
        {isInsecureWebContext ? (
          <Text style={styles.permissionHint}>
            On mobile web, location permission works only on HTTPS or localhost.
          </Text>
        ) : null}
        <ButtonComponent
          buttonText="Allow permission"
          onPress={askLocationPermission}
          viewStyle={styles.permissionButton}
        />
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <Loader visible={showLoader} />

      {reactionPreview !== 0 ? (
        <Animated.View
          key={`reaction-${reactionPreview}`}
          style={styles.fullscreenOverlay}
          entering={FadeIn.duration(120)}
          exiting={FadeOut.duration(260)}
          pointerEvents="none"
        >
          <Icon
            name={reactionPreview === 1 ? "heart" : "close"}
            size={128}
            color={reactionPreview === 1 ? "#ff2d55" : "#ff3b30"}
          />
        </Animated.View>
      ) : null}

      <Header />

      {!locationGranted ? (
        renderPermissionView()
      ) : currentUser ? (
        <>
          <Animated.View
            key={`home-profile-${currentUserIndex}`}
            style={styles.profileShell}
            entering={SlideInUp.duration(320)}
            exiting={SlideOutDown.duration(220)}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.profileContent,
                { paddingBottom: profileBottomPadding },
              ]}
            >
              {renderHero()}
              {renderBio()}

              {sectionsToRender.length > 0 ? (
                sectionsToRender.map(renderSection)
              ) : !currentUserBio ? (
                <Animated.View
                  entering={FadeIn.duration(280)}
                  style={styles.promptCard}
                >
                  <Text style={styles.promptLabel}>Profile</Text>
                  <Text style={styles.promptText}>
                    This person has not added more details yet.
                  </Text>
                </Animated.View>
              ) : null}
            </ScrollView>
          </Animated.View>

          <Animated.View
            entering={SlideInDown.duration(260)}
            style={[styles.stickyActions, { bottom: stickyActionBottom }]}
          >
            <Pressable
              style={styles.actionButton}
              onPress={() => handleReaction(-1)}
            >
              <Icon name="close" size={28} color="#111111" />
            </Pressable>
            <Pressable
              style={[styles.actionButton, styles.likeButton]}
              onPress={() => handleReaction(1)}
            >
              <Icon name="heart" size={30} color="#111111" />
            </Pressable>
          </Animated.View>
        </>
      ) : (
        renderNoUserNearby()
      )}

      <BottomSheetComponent
        ref={swipeLimitSheetRef}
        title="No swipes left"
        subtitle={swipeLimitMessage}
        primaryLabel="Okay"
      />
    </View>
  );
};
