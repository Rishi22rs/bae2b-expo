import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Image, Platform, Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import DotsIcon from "react-native-vector-icons/Entypo";
import Icon from "react-native-vector-icons/Ionicons";
import {
  useAddLikeDislike,
  useGetNearbyUsers,
  useUpdateUserLocation,
} from "../../api/match";
import { ButtonComponent } from "../../components/ButtonComponent";
import { Header } from "../../components/Header";
import Loader from "../../components/Loader";
import { ModalComponent } from "../../components/ModalComponent";
import { navigationConstants } from "../../constants/app-navigation";
import { screenHeight, screenWidth } from "../../utils/dimensions";
import { hexToRgbA } from "../../utils/hexToRgba";
import { requestLocationPermission } from "../../utils/requestLocationPermission";
import { BigText } from "./components/BigText";
import { LineItems } from "./components/LineItems";
import { SmallText } from "./components/SmallText";
import { createStyleSheet } from "./style";

export const Home = ({ route }) => {
  const styles = createStyleSheet();
  const [locationGranted, setLocationGranted] = useState(false);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [coords, setCoords] = useState();
  const [isDetailShown, setIsDetailShown] = useState(false);
  const [showLikeUnlikeView, setShowLikeUnlikeView] = useState(0);
  const navigation = useNavigation();
  const [showLoader, setShowLoader] = useState(true);
  const isInsecureWebContext =
    Platform.OS === "web" &&
    typeof window !== "undefined" &&
    !window.isSecureContext;

  const cardHeight = {
    detailsNotShownHeight: screenHeight - 170,
    detailsShowHeight: screenHeight / 2,
  };

  const getNearyByUsers = () => {
    if (!coords) {
      return;
    }

    setShowLoader(true);
    useGetNearbyUsers({
      latitude: coords?.latitude,
      longitude: coords?.longitude,
      radius: 1000000,
    })
      .then((res) => {
        setNearbyUsers(res?.data || []);
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
        const existingPermission = await Location.getForegroundPermissionsAsync();
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
            latitude: position?.coords?.latitude,
            longitude: position?.coords?.longitude,
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

  const handleLikeDislike = (payload?: object) => {
    console.log("payload", payload);
    useAddLikeDislike(payload)
      .then((res) => {
        if (res?.data?.matched) {
          navigation.replace(navigationConstants.MATCH_ROUTE, {
            screen: navigationConstants.ITS_A_MATCH,
            params: {},
          });
        } else {
          setTimeout(() => {
            setCurrentUserIndex((prev) => prev + 1);
          }, 200);
        }
      })
      .catch((error) => console.log("error", error.response));
  };

  const getCurrentSection = (user: unknown) => {
    switch (user?.type) {
      case "BIG_TEXT":
        return <BigText title={user?.title} content={user?.content} />;
      case "SMALL_TEXT":
        return <SmallText title={user?.title} content={user?.content} />;
      case "SMALL_TEXT_LIST":
        return <LineItems title={user?.title} content={user?.content} />;
    }
  };

  const imageHeight = useSharedValue(screenHeight - 170);
  const currentUser = nearbyUsers?.[currentUserIndex];
  const currentUserImages = useMemo(() => {
    const imageCandidates = [
      ...(Array.isArray(currentUser?.images) ? currentUser.images : []),
      ...(Array.isArray(currentUser?.photos) ? currentUser.photos : []),
      currentUser?.profileImage,
      currentUser?.profile_image,
      currentUser?.imageUrl,
    ];

    return imageCandidates.filter(
      (imageUri, index, self) =>
        typeof imageUri === "string" &&
        imageUri.trim().length > 0 &&
        self.indexOf(imageUri) === index,
    );
  }, [currentUser]);
  const activeImageUri =
    currentUserImages[currentPhotoIndex] ||
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e";

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      height: imageHeight.value,
    };
  });

  const handleLikeUnlikeView = (like: -1 | 1 = -1) => {
    // setTimeout(() => {
    setShowLikeUnlikeView(like);
    handleLikeDislike({
      other_user_id: nearbyUsers?.[currentUserIndex]?.userId,
      is_like: like === 1 ? 1 : 0,
    });
    setTimeout(() => {
      setShowLikeUnlikeView(0);
    }, 1000);
    // }, 500);
    handlebackPress();
  };

  const handlebackPress = () => {
    imageHeight.value = withSpring(cardHeight.detailsNotShownHeight);
    setIsDetailShown(false);
  };

  const showPreviousPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const showNextPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev < currentUserImages.length - 1 ? prev + 1 : prev,
    );
  };

  const renderCard = () => {
    const CardComponent = isDetailShown ? ScrollView : View;
    return (
      <CardComponent
        style={!isDetailShown ? styles.container : {}}
        contentContainerStyle={styles.container}
      >
        <Animated.View style={styles.imageContainer}>
          <Pressable>
            <Animated.Image
              source={{
                uri: activeImageUri,
              }}
              style={[styles.profileImage, animatedImageStyle]}
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
              <Pressable
                onPress={showPreviousPhoto}
                style={styles.imageTapZone}
              />
              <Pressable onPress={showNextPhoto} style={styles.imageTapZone} />
            </View>
            {!isDetailShown ? (
              <View>
                <LinearGradient
                  colors={[
                    hexToRgbA("#000000", 90),
                    hexToRgbA("#000000", 80),
                    hexToRgbA("#000000", 50),
                    "transparent",
                  ]}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  style={styles.userDetailImageTop}
                >
                    <Text style={styles.userDetailImageTopText}>
                      {
                        nearbyUsers?.[currentUserIndex]?.segregatedList?.[0]
                          ?.content
                      }
                    </Text>
                  <Pressable
                    onPress={() => {
                      if (!isDetailShown) {
                        imageHeight.value = withSpring(
                          cardHeight.detailsShowHeight,
                        );
                        setIsDetailShown(true);
                      }
                    }}
                  >
                    <DotsIcon
                      name="dots-three-vertical"
                      size={24}
                      color="#ffffff"
                    />
                  </Pressable>
                </LinearGradient>
              </View>
            ) : null}
          </Pressable>
          {isDetailShown ? (
            <Pressable onPress={handlebackPress} style={styles.backBtn}>
              <Icon name="chevron-back" size={24} color="#000" />
            </Pressable>
          ) : null}
        </Animated.View>
        {/* Buttons below image */}
        <View style={styles.actionButtons}>
          <Pressable
            style={styles.circleButtonBig}
            onPress={() => handleLikeUnlikeView(-1)}
          >
            <Icon name="close" size={24} color="#ff3b30" />
          </Pressable>
          <Pressable
            style={styles.circleButtonBig}
            onPress={() => handleLikeUnlikeView(1)}
          >
            <Icon name="heart" size={28} color="#ff2d55" />
          </Pressable>
        </View>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          {nearbyUsers?.[currentUserIndex]?.segregatedList?.length ? (
            nearbyUsers?.[currentUserIndex]?.segregatedList?.map((user, index) => {
              return (
                <View key={`${user?.type}-${user?.title}-${index}`}>
                  {getCurrentSection(user)}
                </View>
              );
            })
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.sectionTitle}>Profile</Text>
              <Text style={styles.aboutText}>
                This user has not added profile details yet.
              </Text>
            </View>
          )}
        </View>
      </CardComponent>
    );
  };

  const renderNoUserNearby = () => {
    return (
      <View>
        <Image
          source={require("../../assets/noUsers.png")}
          style={{
            height: 500,
            width: screenWidth,
          }}
        />
        <Text
          style={{
            paddingHorizontal: 30,
            fontWeight: "500",
            fontSize: 30,
            color: "#f96163",
            textAlign: "center",
          }}
        >
          You're ahead of the crowd! We'll let you know when someone new pops
          up.
        </Text>
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <Loader visible={showLoader} />
      {/* {like or unlike view} */}
      {showLikeUnlikeView !== 0 && (
        <Animated.View
          style={[styles.fullscreenOverlay, styles.likeUnlikeView]}
          key={`likeUnlike-${showLikeUnlikeView}`}
          entering={FadeIn.duration(1000)}
          exiting={FadeOut.duration(2000)}
          pointerEvents="none" // ensures it doesn't block user interactions
        >
          <View>
            {showLikeUnlikeView === -1 ? (
              <Icon name="close" size={240} color="#ff3b30" />
            ) : (
              <Icon name="heart" size={240} color="#ff2d55" />
            )}
          </View>
        </Animated.View>
      )}
      <Header />
      {locationGranted ? (
        <Animated.View
          key={`card-${currentUserIndex}`}
          entering={SlideInDown.duration(1000)}
          exiting={SlideOutDown.duration(500)}
        >
          {nearbyUsers?.length !== currentUserIndex
            ? renderCard()
            : renderNoUserNearby()}
        </Animated.View>
      ) : (
        <View style={styles.background}>
          <Text style={styles.nameText}>
            We need your location to serve users near you.
          </Text>
          {isInsecureWebContext && (
            <Text style={[styles.nameText, { fontSize: 14, marginTop: 8 }]}>
              On mobile web, location permission works only on HTTPS (or localhost).
              Open this site over HTTPS, then tap Allow permission.
            </Text>
          )}
          <ButtonComponent
            buttonText="Allow permission"
            onPress={askLocationPermission}
          />
        </View>
      )}
      <ModalComponent>
        <Text>No likes left</Text>
      </ModalComponent>
    </View>
  );
};
