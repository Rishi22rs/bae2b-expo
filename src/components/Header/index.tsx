import {useNavigation} from '@react-navigation/native';
import {Pressable, View} from 'react-native';
import FeatherIcons from 'react-native-vector-icons/Feather';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {TextComponent} from '../TextComponent';
import {createStyleSheet} from './style';

interface HeaderProps {
  prefixTitle?: string;
  title?: string;
  showRightComponent?: boolean;
  onRightComponentClick?: () => void;
  showBack?: boolean;
  onBackPress?: () => void;
}

export const Header = ({
  prefixTitle = 'Explore',
  title = 'OnlyOne',
  showRightComponent = false,
  onRightComponentClick,
  showBack = false,
  onBackPress,
}: HeaderProps) => {
  const navigation = useNavigation();
  const style = createStyleSheet();
  return (
    <View style={style.container}>
      <View style={style.backAndTitleContainer}>
        {showBack ? (
          <Pressable onPress={() => onBackPress?.()}>
            <FeatherIcons
              style={style.backIcon}
              name="arrow-left"
              size={25}
              color="#176FF2"
            />
          </Pressable>
        ) : null}
        <View>
          {prefixTitle ? (
            <TextComponent viewStyle={style.preTitle}>
              {prefixTitle}
            </TextComponent>
          ) : null}
          <TextComponent viewStyle={style.title}>{title}</TextComponent>
        </View>
      </View>
      <View style={style.locationContainer}>
        {showRightComponent ? (
          <IonIcons
            style={style.locationIcon}
            name="reorder-three-outline"
            size={40}
            color="black"
            onPress={onRightComponentClick}
          />
        ) : null}
      </View>
    </View>
  );
};
