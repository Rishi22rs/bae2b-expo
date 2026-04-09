import React, {useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createStyleSheet} from './style';
import {Header} from '../../components/Header';
import {useNavigation} from '@react-navigation/native';
import {navigationConstants} from '../../constants/app-navigation';
import {defaultTheme} from '../../config/theme';
import {unmatch} from '../../api/match';

interface ItsAMatchRouteParams {
  firstImageUrl?: string;
  secondImageUrl?: string;
  firstName?: string;
  secondName?: string;
  title?: string;
  subtitle?: string;
  description?: string;
}

interface ItsAMatchProps {
  route?: {
    params?: ItsAMatchRouteParams;
  };
}

const DEFAULT_FIRST_IMAGE =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1';
const DEFAULT_SECOND_IMAGE =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e';

export const ItsAMatch = ({route}: ItsAMatchProps) => {
  const navigation = useNavigation();
  const {width: windowWidth} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [isUnmatching, setIsUnmatching] = useState(false);
  const isWeb = Platform.OS === 'web';
  const styles = useMemo(() => createStyleSheet(windowWidth), [windowWidth]);

  const routeParams = route?.params || {};
  const firstName = routeParams?.firstName?.trim() || 'You';
  const secondName = routeParams?.secondName?.trim() || 'Your Match';
  const title = routeParams?.title?.trim() || "It's a Match";
  const subtitle = routeParams?.subtitle?.trim() || 'Congratulations';
  const description =
    routeParams?.description?.trim() ||
    'You both liked each other. Start a conversation now.';
  const firstImageUrl = routeParams?.firstImageUrl || DEFAULT_FIRST_IMAGE;
  const secondImageUrl = routeParams?.secondImageUrl || DEFAULT_SECOND_IMAGE;
  const computedCardWidth = Math.floor((windowWidth - (isWeb ? 110 : 96)) / 2);
  const cardWidth = Math.max(100, Math.min(168, computedCardWidth));
  const cardHeight = Math.round(cardWidth * (isWeb ? 1.2 : 1.24));
  const cardRadius = Math.round(cardWidth * 0.15);
  const bottomSpacing = isWeb ? 20 : Math.max(18, insets.bottom + 8);

  const handleProfileNavigation = () => {
    navigation.navigate(navigationConstants.MATCH_ROUTE, {
      screen: navigationConstants.VIEW_ONLY_PROFILE,
    });
  };

  const handleChatNavigation = () => {
    navigation.navigate(navigationConstants.MATCH_ROUTE, {
      screen: navigationConstants.CHAT,
      params: {},
    });
  };

  const handleUnmatch = async () => {
    if (isUnmatching) {
      return;
    }

    setIsUnmatching(true);
    try {
      await unmatch();
      navigation.navigate(navigationConstants.BOTTOM_TABS, {
        screen: navigationConstants.HOME_ROUTE,
        params: {},
      });
    } catch (error) {
      console.error('unmatch failed:', error);
    } finally {
      setIsUnmatching(false);
    }
  };

  return (
    <>
      <Header prefixTitle="Match" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          {paddingBottom: bottomSpacing},
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroTagRow}>
            <View style={styles.heroTag}>
              <Ionicons name="sparkles" size={13} color={defaultTheme.pinkText} />
              <Text style={styles.heroTagText}>NEW MATCH</Text>
            </View>
          </View>

          <View style={styles.avatarStage}>
            <View style={styles.avatarPair}>
              <View
                style={[
                  styles.avatarShell,
                  styles.avatarLeft,
                  {width: cardWidth, height: cardHeight, borderRadius: cardRadius},
                ]}>
                <Image source={{uri: firstImageUrl}} style={styles.avatarImage} />
                <LinearGradient
                  colors={['rgba(0,0,0,0.86)', 'rgba(0,0,0,0.18)', 'transparent']}
                  start={{x: 0.5, y: 1}}
                  end={{x: 0.5, y: 0}}
                  style={styles.avatarOverlay}
                />
                <View style={styles.nameChip}>
                  <Text style={styles.nameChipText} numberOfLines={1}>
                    {firstName}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.avatarShell,
                  styles.avatarRight,
                  {width: cardWidth, height: cardHeight, borderRadius: cardRadius},
                ]}>
                <Image source={{uri: secondImageUrl}} style={styles.avatarImage} />
                <LinearGradient
                  colors={['rgba(0,0,0,0.86)', 'rgba(0,0,0,0.18)', 'transparent']}
                  start={{x: 0.5, y: 1}}
                  end={{x: 0.5, y: 0}}
                  style={styles.avatarOverlay}
                />
                <View style={styles.nameChip}>
                  <Text style={styles.nameChipText} numberOfLines={1}>
                    {secondName}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.heartBadge}>
              <Ionicons name="heart" size={20} color="#ffffff" />
            </View>
          </View>

          <Text style={styles.subtitle}>{subtitle}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          <View style={styles.actionContainer}>
            <LinearGradient
              colors={[defaultTheme.pinkPrimary, defaultTheme.pinkSecondary]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.primaryButtonGradient}>
              <Pressable
                style={({pressed}) => [
                  styles.primaryButton,
                  pressed ? styles.primaryButtonPressed : null,
                ]}
                onPress={handleChatNavigation}>
                <Text style={styles.primaryButtonText}>Say Hello</Text>
              </Pressable>
            </LinearGradient>

            <Pressable
              style={({pressed}) => [
                styles.secondaryButton,
                pressed ? styles.secondaryButtonPressed : null,
              ]}
              onPress={handleProfileNavigation}>
              <Text style={styles.secondaryButtonText}>View Profile</Text>
            </Pressable>

            <Pressable
              style={({pressed}) => [
                styles.unmatchButton,
                pressed ? styles.unmatchButtonPressed : null,
                isUnmatching ? styles.unmatchButtonDisabled : null,
              ]}
              onPress={handleUnmatch}
              disabled={isUnmatching}>
              {isUnmatching ? (
                <ActivityIndicator color={defaultTheme.pinkText} size="small" />
              ) : (
                <Text style={styles.unmatchButtonText}>Unmatch</Text>
              )}
            </Pressable>

            <Text style={styles.footerNote}>
              Start with a quick hello to keep the vibe going.
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
};
