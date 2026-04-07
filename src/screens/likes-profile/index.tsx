import {LinearGradient} from 'expo-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {ActivityIndicator, Image, Pressable, ScrollView, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAddLikeDislike} from '../../api/match';
import {Header} from '../../components/Header';
import {defaultTheme} from '../../config/theme';
import {screenHeight} from '../../utils/dimensions';
import {createStyleSheet} from './style';

interface ProfileSection {
  type: 'BIG_TEXT' | 'SMALL_TEXT' | 'SMALL_TEXT_LIST';
  title: string;
  content: string | Array<{value?: string} | string>;
}

interface LikesProfileUser {
  id: string;
  userId?: string;
  name?: string;
  age?: number;
  location?: string;
  imageUrl?: string;
  profileImage?: string;
  profile_image?: string;
  images?: string[];
  photos?: string[];
  segregatedList?: ProfileSection[];
}

interface LikesProfileScreenProps {
  route?: {
    params?: {
      user?: LikesProfileUser;
    };
  };
}

const DEFAULT_PROFILE_IMAGE =
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e';

const parseNameAgeFromHeadline = (headline?: string) => {
  if (!headline) {
    return {};
  }

  const [namePart, agePart] = headline.split(',').map(part => part?.trim());
  const parsedAge = Number(agePart);

  return {
    name: namePart || undefined,
    age: Number.isNaN(parsedAge) ? undefined : parsedAge,
  };
};

const resolveListValues = (content: ProfileSection['content']) => {
  if (!Array.isArray(content)) {
    return [];
  }

  return content
    .map(item => {
      if (typeof item === 'string') {
        return item.trim();
      }

      return (item?.value || '').trim();
    })
    .filter(Boolean);
};

const getStringContent = (content: ProfileSection['content']) => {
  if (typeof content === 'string') {
    return content;
  }

  return '';
};

export const LikesProfile = ({route}: LikesProfileScreenProps) => {
  const styles = createStyleSheet();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const user = route?.params?.user;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'like' | 'dislike' | null>(
    null,
  );
  const profileData = user?.segregatedList || ([] as ProfileSection[]);
  const targetUserId = user?.userId || user?.id;

  const headlineContent = getStringContent(
    profileData?.find(section => section?.type === 'BIG_TEXT')?.content || '',
  );
  const parsedHeadline = parseNameAgeFromHeadline(headlineContent);
  const displayName = user?.name || parsedHeadline?.name || 'Profile';
  const displayAge =
    typeof user?.age === 'number' ? user?.age : parsedHeadline?.age;

  const resolvedImageUrl =
    user?.imageUrl ||
    user?.profileImage ||
    user?.profile_image ||
    user?.images?.[0] ||
    user?.photos?.[0] ||
    DEFAULT_PROFILE_IMAGE;

  const locationSection = profileData?.find(
    section =>
      section?.type === 'SMALL_TEXT' &&
      section?.title?.toLowerCase()?.includes('location'),
  );
  const displayLocation =
    user?.location || getStringContent(locationSection?.content || '');

  const sectionsToRender = profileData.filter(section => {
    if (section?.type === 'BIG_TEXT') {
      return false;
    }

    if (section?.type === 'SMALL_TEXT') {
      return getStringContent(section?.content)?.trim()?.length > 0;
    }

    if (section?.type === 'SMALL_TEXT_LIST') {
      return resolveListValues(section?.content)?.length > 0;
    }

    return false;
  });

  const heroHeight = Math.max(330, Math.min(screenHeight * 0.5, 520));

  const handleLikeDislike = async (action: 'like' | 'dislike') => {
    if (!targetUserId || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSelectedAction(action);

    try {
      await useAddLikeDislike({
        other_user_id: targetUserId,
        is_like: action === 'like' ? 1 : 0,
      });
      navigation.goBack();
    } catch (error) {
      console.error('like/dislike from profile failed:', error);
      setSelectedAction(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProfileSection = (section: ProfileSection, index: number) => {
    const title = section?.title || `Section ${index + 1}`;

    if (section?.type === 'SMALL_TEXT') {
      return (
        <View key={`${title}-${index}`} style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionBody}>{getStringContent(section.content)}</Text>
        </View>
      );
    }

    if (section?.type === 'SMALL_TEXT_LIST') {
      const listItems = resolveListValues(section?.content);

      return (
        <View key={`${title}-${index}`} style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <View style={styles.chipsContainer}>
            {listItems.map((item, itemIndex) => (
              <View key={`${item}-${itemIndex}`} style={styles.infoChip}>
                <Text style={styles.infoChipText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <Header
        prefixTitle="Liked You"
        title="Profile"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {paddingBottom: 104 + Math.max(insets.bottom, 8)},
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.contentInner}>
          <View style={styles.imageWrap}>
            <Image
              source={{
                uri: resolvedImageUrl,
              }}
              style={[styles.image, {height: heroHeight}]}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.03)']}
              start={{x: 0.5, y: 1}}
              end={{x: 0.5, y: 0}}
              style={styles.imageOverlay}
            />
            <View style={styles.heroTopRow}>
              <View style={styles.likedBadge}>
                <Text style={styles.likedBadgeText}>Liked You</Text>
              </View>
            </View>

            <View style={styles.overlayContent}>
              <View style={styles.nameRow}>
                <Text style={styles.overlayTitle}>{displayName}</Text>
                {typeof displayAge === 'number' ? (
                  <View style={styles.agePill}>
                    <Text style={styles.ageText}>{displayAge}</Text>
                  </View>
                ) : null}
              </View>

              {displayLocation ? (
                <View style={styles.locationPill}>
                  <Ionicons name="location-outline" size={14} color="#ffffff" />
                  <Text style={styles.locationText}>{displayLocation}</Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.profileInfo}>
            {sectionsToRender?.length ? (
              sectionsToRender?.map((section, index) =>
                renderProfileSection(section, index),
              )
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.sectionTitle}>Profile</Text>
                <Text style={styles.sectionBody}>
                  This user has not added profile details yet.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.stickyActionBar,
          {paddingBottom: Math.max(insets.bottom, 10)},
        ]}>
        <View style={styles.stickyActionInner}>
          <Pressable
            style={[
              styles.actionButton,
              styles.dislikeButton,
              selectedAction === 'dislike' ? styles.dislikeButtonActive : null,
              isSubmitting || !targetUserId ? styles.actionButtonDisabled : null,
            ]}
            onPress={() => handleLikeDislike('dislike')}
            disabled={isSubmitting || !targetUserId}>
            <Ionicons name="close" size={20} color={defaultTheme.pinkText} />
            <Text style={styles.dislikeButtonText}>Dislike</Text>
          </Pressable>

          <Pressable
            style={[
              styles.actionButton,
              styles.likeButton,
              selectedAction === 'like' ? styles.likeButtonActive : null,
              isSubmitting || !targetUserId ? styles.actionButtonDisabled : null,
            ]}
            onPress={() => handleLikeDislike('like')}
            disabled={isSubmitting || !targetUserId}>
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <>
                <Ionicons name="heart" size={18} color="#ffffff" />
                <Text style={styles.likeButtonText}>Like</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
};
