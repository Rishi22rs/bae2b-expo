import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';
import {unmatch, useMatchedUserData, useMatchedUserIds} from '../../api/match';
import {extractUserInfoData, useGetUserInfo} from '../../api/profile';
import {
  BottomSheetComponent,
  BottomSheetHandle,
} from '../../components/BottomSheetComponent';
import {ButtonComponent} from '../../components/ButtonComponent';
import {Header} from '../../components/Header';
import {navigationConstants} from '../../constants/app-navigation';
import {showErrorToast} from '../../utils/toast';
import {createStyleSheet} from './style';

interface ProfileSection {
  type: 'BIG_TEXT' | 'SMALL_TEXT' | 'SMALL_TEXT_LIST';
  title: string;
  content: string | Array<{value?: string} | string>;
}

interface MatchRouteParams {
  firstImageUrl?: string;
  secondImageUrl?: string;
}

interface MatchScreenProps {
  route?: {
    params?: MatchRouteParams;
  };
}

interface MatchedUserPayload {
  id: string;
  userId?: string;
  name?: string;
  age?: number;
  imageUrl?: string;
  profileImage?: string;
  profile_image?: string;
  images?: string[];
  photos?: string[];
  segregatedList?: ProfileSection[];
}

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

const getStringContent = (content: ProfileSection['content']) => {
  if (typeof content === 'string') {
    return content;
  }

  return '';
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
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) {
    return undefined;
  }

  return parsed;
};

const normalizeMatchedUserImages = (user: Record<string, unknown>) => {
  const imageCandidates = [
    ...(Array.isArray(user?.images) ? (user.images as string[]) : []),
    ...(Array.isArray(user?.photos) ? (user.photos as string[]) : []),
    user?.profileImage,
    user?.profile_image,
    user?.imageUrl,
  ];

  return imageCandidates.filter(
    (imageUri, index, self) =>
      typeof imageUri === 'string' &&
      imageUri.trim().length > 0 &&
      self.indexOf(imageUri) === index,
  ) as string[];
};

const buildMatchedUser = ({
  profileData,
  idsData,
  matchedPayload,
}: {
  profileData: ProfileSection[];
  idsData: Record<string, unknown>;
  matchedPayload?: Record<string, unknown>;
}): MatchedUserPayload => {
  const headlineContent = getStringContent(
    profileData?.find(section => section?.type === 'BIG_TEXT')?.content || '',
  );
  const parsedHeadline = parseNameAgeFromHeadline(headlineContent);
  const matchedImages = normalizeMatchedUserImages(matchedPayload || {});

  return {
    id: String(
      (matchedPayload?.id as string) ||
        (matchedPayload?._id as string) ||
        (idsData?.other_user_id as string) ||
        'matched-user',
    ),
    userId:
      (matchedPayload?.userId as string) ||
      (matchedPayload?.id as string) ||
      (matchedPayload?._id as string) ||
      (idsData?.other_user_id as string) ||
      undefined,
    name:
      (matchedPayload?.name as string) ||
      (matchedPayload?.full_name as string) ||
      parsedHeadline?.name,
    age:
      parseAgeValue(matchedPayload?.age) ??
      parseAgeValue(matchedPayload?.user_age) ??
      getAgeFromBirthday(matchedPayload?.birthday as string) ??
      parsedHeadline?.age,
    imageUrl:
      matchedImages[0] ||
      (matchedPayload?.imageUrl as string) ||
      (matchedPayload?.profileImage as string) ||
      (matchedPayload?.profile_image as string),
    profileImage: matchedPayload?.profileImage as string,
    profile_image: matchedPayload?.profile_image as string,
    images: Array.isArray(matchedPayload?.images)
      ? (matchedPayload.images as string[])
      : [],
    photos: Array.isArray(matchedPayload?.photos)
      ? (matchedPayload.photos as string[])
      : [],
    segregatedList: profileData,
  };
};

export const ItsAMatch = ({route}: MatchScreenProps) => {
  const styles = createStyleSheet();
  const navigation = useNavigation();
  const unmatchConfirmSheetRef = useRef<BottomSheetHandle>(null);
  const [matchedUser, setMatchedUser] = useState<MatchedUserPayload | null>(null);
  const [currentUserImage, setCurrentUserImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUnmatching, setIsUnmatching] = useState(false);

  const fetchMatchedProfile = async () => {
    setLoading(true);
    setError('');

    try {
      const [profileResponse, idsResponse] = await Promise.all([
        useMatchedUserData(),
        useMatchedUserIds(),
      ]);

      const rawMatchedData = profileResponse?.data;
      const normalizedMatchedPayload =
        rawMatchedData && !Array.isArray(rawMatchedData)
          ? ((rawMatchedData as Record<string, unknown>)?.user as
              | Record<string, unknown>
              | undefined) ||
            ((rawMatchedData as Record<string, unknown>)?.matched_user as
              | Record<string, unknown>
              | undefined) ||
            ((rawMatchedData as Record<string, unknown>)?.matchedUser as
              | Record<string, unknown>
              | undefined) ||
            (rawMatchedData as Record<string, unknown>)
          : undefined;

      const profileData = Array.isArray(rawMatchedData)
        ? (rawMatchedData as ProfileSection[])
        : Array.isArray(
              (normalizedMatchedPayload as Record<string, unknown>)
                ?.segregatedList,
            )
          ? ((normalizedMatchedPayload as Record<string, unknown>)
              ?.segregatedList as ProfileSection[])
          : Array.isArray(
                (normalizedMatchedPayload as Record<string, unknown>)
                  ?.segregated_list,
              )
            ? ((normalizedMatchedPayload as Record<string, unknown>)
                ?.segregated_list as ProfileSection[])
            : [];
      const idsData =
        (idsResponse?.data as Record<string, unknown>) ||
        ({} as Record<string, unknown>);

      setMatchedUser(
        buildMatchedUser({
          profileData,
          idsData,
          matchedPayload: normalizedMatchedPayload,
        }),
      );
    } catch (fetchError) {
      console.error('fetch matched profile failed:', fetchError);
      setError('Unable to load your match right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchedProfile();
  }, []);

  useEffect(() => {
    let isMounted = true;

    useGetUserInfo()
      .then(res => {
        if (!isMounted) {
          return;
        }

        const user = extractUserInfoData(res) as Record<string, unknown>;
        const userImages = normalizeMatchedUserImages(user);
        setCurrentUserImage(userImages[0] || '');
      })
      .catch(error => {
        console.error('fetch current user image failed:', error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const matchedUserImages = useMemo(() => {
    return normalizeMatchedUserImages((matchedUser || {}) as Record<string, unknown>);
  }, [matchedUser]);

  const secondaryImageUri =
    matchedUserImages[0] ||
    matchedUser?.imageUrl ||
    route?.params?.secondImageUrl ||
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80';

  const primaryImageUri = useMemo(() => {
    return (
      currentUserImage ||
      route?.params?.firstImageUrl ||
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80'
    );
  }, [currentUserImage, route?.params?.firstImageUrl]);

  const headline = matchedUser?.name
    ? `${matchedUser.name}${matchedUser.age ? `, ${matchedUser.age}` : ''}`
    : 'You both liked each other';

  const handleProfileNavigation = () => {
    (navigation as any).navigate(navigationConstants.VIEW_ONLY_PROFILE, {});
  };

  const handleChatNavigation = () => {
    (navigation as any).navigate(navigationConstants.CHAT, {});
  };

  const openUnmatchConfirmation = () => {
    if (isUnmatching) {
      return;
    }

    unmatchConfirmSheetRef.current?.open();
  };

  const handleUnmatch = async () => {
    if (isUnmatching) {
      return;
    }

    try {
      setIsUnmatching(true);
      await unmatch();
      (navigation as any).navigate(navigationConstants.BOTTOM_TABS, {
        screen: navigationConstants.HOME_ROUTE,
        params: {},
      });
    } catch (unmatchError: any) {
      showErrorToast(
        unmatchError?.response?.data?.message ||
          unmatchError?.message ||
          'Unable to unmatch right now.',
        {
          title: 'Something went wrong',
        },
      );
    } finally {
      setIsUnmatching(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={styles.loaderAccent.color} />
        <Text style={styles.loaderText}>Loading your match...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={fetchMatchedProfile}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <Header prefixTitle="Match" title="OnlyOne" />
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>It&apos;s a match</Text>
          </View>

          <Text style={styles.title}>You found your vibe.</Text>
          <Text style={styles.subtitle}>
            {headline}. Start the convo or check the full profile first.
          </Text>

          <View style={styles.cardStack}>
            <Image
              source={{uri: primaryImageUri}}
              style={[styles.profileCard, styles.profileCardLeft]}
            />
            <Image
              source={{uri: secondaryImageUri}}
              style={[styles.profileCard, styles.profileCardRight]}
            />
          </View>

          <View style={styles.actions}>
            <Pressable
              style={styles.secondaryButton}
              onPress={handleProfileNavigation}>
              <Text style={styles.secondaryButtonText}>Profile</Text>
            </Pressable>

            <ButtonComponent
              onPress={handleChatNavigation}
              viewStyle={styles.primaryButton}
              buttonText="Chat"
            />

            <Pressable
              style={[
                styles.ghostButton,
                isUnmatching ? styles.ghostButtonDisabled : null,
              ]}
              disabled={isUnmatching}
              onPress={openUnmatchConfirmation}>
              <Text style={styles.ghostButtonText}>
                {isUnmatching ? 'Unmatching...' : 'Unmatch'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
      <BottomSheetComponent
        ref={unmatchConfirmSheetRef}
        title="Unmatch this person?"
        subtitle="Are you sure? This will remove the match and the chat from your app."
        primaryLabel={isUnmatching ? 'Unmatching...' : 'Yes, unmatch'}
        onPrimaryPress={handleUnmatch}
        secondaryLabel="Cancel"
      />
    </>
  );
};
