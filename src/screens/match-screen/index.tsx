import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Pressable, Text, View} from 'react-native';
import {useMatchedUserData, useMatchedUserIds} from '../../api/match';
import {LikesProfile} from '../likes-profile';
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
  location?: string;
  imageUrl?: string;
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

const buildMatchedUser = ({
  profileData,
  idsData,
  routeImageUrl,
}: {
  profileData: ProfileSection[];
  idsData: Record<string, unknown>;
  routeImageUrl?: string;
}): MatchedUserPayload => {
  const headlineContent = getStringContent(
    profileData?.find(section => section?.type === 'BIG_TEXT')?.content || '',
  );
  const parsedHeadline = parseNameAgeFromHeadline(headlineContent);

  const locationSection = profileData?.find(
    section =>
      section?.type === 'SMALL_TEXT' &&
      section?.title?.toLowerCase()?.includes('location'),
  );

  return {
    id: String((idsData?.other_user_id as string) || 'matched-user'),
    userId: (idsData?.other_user_id as string) || undefined,
    name: parsedHeadline?.name,
    age: parsedHeadline?.age,
    location: getStringContent(locationSection?.content || ''),
    imageUrl: routeImageUrl,
    segregatedList: profileData,
  };
};

export const ItsAMatch = ({route}: MatchScreenProps) => {
  const styles = createStyleSheet();
  const [matchedUser, setMatchedUser] = useState<MatchedUserPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMatchedProfile = async () => {
    setLoading(true);
    setError('');

    try {
      const [profileResponse, idsResponse] = await Promise.all([
        useMatchedUserData(),
        useMatchedUserIds(),
      ]);

      const profileData = Array.isArray(profileResponse?.data)
        ? (profileResponse.data as ProfileSection[])
        : [];
      const idsData =
        (idsResponse?.data as Record<string, unknown>) ||
        ({} as Record<string, unknown>);

      setMatchedUser(
        buildMatchedUser({
          profileData,
          idsData,
          routeImageUrl:
            route?.params?.secondImageUrl || route?.params?.firstImageUrl,
        }),
      );
    } catch (fetchError) {
      console.error('fetch matched profile failed:', fetchError);
      setError('Unable to load matched profile right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchedProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#f74a6e" />
        <Text style={styles.loaderText}>Loading your match...</Text>
      </View>
    );
  }

  if (error || !matchedUser) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>
          {error || 'Unable to open matched profile.'}
        </Text>
        <Pressable style={styles.retryButton} onPress={fetchMatchedProfile}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <LikesProfile
      route={{
        params: {
          user: matchedUser,
          context: 'match',
          badgeText: "It's a Match",
        },
      }}
    />
  );
};
