import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useCallback, useMemo, useState } from "react";
import {
  Image,
  LayoutChangeEvent,
  Pressable,
  View,
  useWindowDimensions,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { TextComponent } from "../../components/TextComponent";
import { navigationConstants } from "../../constants/app-navigation";
import { createStyleSheet } from "./style";

const LANDING_CAROUSEL_IMAGES = [
  require("../../assets/car1.png"),
  require("../../assets/car2.png"),
  require("../../assets/car3.png"),
];

const LANDING_TAGLINES = [
  "1 real connection > 100 randoms.",
  "Pick one. Build real.",
  "One vibe. One person. No cap.",
  "One person who truly gets you.",
  "One meaningful match over many maybes.",
];

export const Login = () => {
  const style = createStyleSheet();
  const navigation = useNavigation();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [containerSize, setContainerSize] = useState({
    width: windowWidth,
    height: windowHeight,
  });
  const landingTagline = useMemo(
    () => LANDING_TAGLINES[Math.floor(Math.random() * LANDING_TAGLINES.length)],
    [],
  );
  const isLongTagline = landingTagline.length > 32;
  const carouselWidth = containerSize.width || windowWidth;
  const carouselHeight = containerSize.height || windowHeight;

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const nextWidth = Math.round(event.nativeEvent.layout.width);
    const nextHeight = Math.round(event.nativeEvent.layout.height);

    if (nextWidth <= 0 || nextHeight <= 0) {
      return;
    }

    setContainerSize((prev) =>
      prev.width === nextWidth && prev.height === nextHeight
        ? prev
        : {
            width: nextWidth,
            height: nextHeight,
          },
    );
  }, []);

  const handleGetStarted = () => {
    (navigation as any).navigate(navigationConstants.LOGIN_PAGE);
  };

  const handleLogin = () => {
    (navigation as any).navigate(navigationConstants.LOGIN_PAGE);
  };

  return (
    <View style={style.landingRoot} onLayout={handleLayout}>
      <StatusBar style="light" backgroundColor="#111111" />
      <Carousel
        width={carouselWidth}
        height={carouselHeight}
        data={LANDING_CAROUSEL_IMAGES}
        loop
        autoPlay
        autoPlayInterval={3200}
        scrollAnimationDuration={780}
        style={style.landingCarousel}
        renderItem={({ item }) => (
          <Image
            source={item}
            style={style.landingBgImage}
            resizeMode="cover"
          />
        )}
      />
      <LinearGradient
        colors={["rgba(0,0,0,0.16)", "rgba(0,0,0,0.82)"]}
        start={{ x: 0.5, y: 0.08 }}
        end={{ x: 0.5, y: 1 }}
        style={style.landingOverlay}
      />

      <View style={style.landingTopBar}>
        <View style={style.landingProgressLine} />
        <View style={style.landingBrand}>
          <TextComponent viewStyle={style.landingBrandText}>B2B</TextComponent>
        </View>
      </View>

      <View style={style.landingBottomArea}>
        <TextComponent
          viewStyle={[
            style.landingTitle,
            isLongTagline ? style.landingTitleCompact : null,
          ]}
        >
          {landingTagline}
        </TextComponent>

        <Pressable
          style={style.landingPrimaryButton}
          onPress={handleGetStarted}
        >
          <TextComponent viewStyle={style.landingPrimaryButtonText}>
            Get Started
          </TextComponent>
        </Pressable>

        <TextComponent viewStyle={style.landingLegalText}>
          By tapping "Sign in", you agree to our EULA, the Terms of{"\n"}Use and
          the Acceptable Use Policy.
        </TextComponent>
      </View>
    </View>
  );
};
