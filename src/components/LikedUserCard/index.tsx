import React from 'react';
import {LinearGradient} from 'expo-linear-gradient';
import {Image, Pressable, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createStyleSheet} from './style';

export interface LikedUserCardProps {
  name?: string;
  age?: number;
  location?: string;
  imageUrl?: string;
  badgeText?: string;
  onPress?: () => void;
}

export const LikedUserCard = ({
  name,
  age,
  location,
  imageUrl,
  badgeText = 'Liked You',
  onPress,
}: LikedUserCardProps) => {
  const styles = createStyleSheet();
  const resolvedName = name || 'Profile';
  const resolvedImageUrl =
    imageUrl ||
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e';

  return (
    <Pressable
      style={({pressed}) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
      android_ripple={{color: 'rgba(255,255,255,0.15)'}}>
      <View style={styles.surface}>
        <View style={styles.mediaContainer}>
          <Image
            source={{uri: resolvedImageUrl}}
            style={styles.image}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.85)', 'rgba(0,0,0,0.45)', 'rgba(0,0,0,0.04)']}
            start={{x: 0.5, y: 1}}
            end={{x: 0.5, y: 0}}
            style={styles.imageOverlay}
          />
          {!!badgeText ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badgeText}</Text>
            </View>
          ) : null}
          <View style={styles.infoOverlay}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {resolvedName}
              </Text>
              {typeof age === 'number' ? (
                <Text style={styles.age}>{age}</Text>
              ) : null}
            </View>
            {location ? (
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={12} color="#ffffff" />
                <Text numberOfLines={1} style={styles.locationText}>
                  {location}
                </Text>
              </View>
            ) : null}
            <View style={styles.footerRow}>
              <View style={styles.statusChip}>
                <Ionicons name="heart" size={11} color="#ffffff" />
                <Text style={styles.statusText}>Interested</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ffffff" />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
