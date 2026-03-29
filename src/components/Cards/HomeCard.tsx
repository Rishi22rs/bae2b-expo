import {ImageBackground, View} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import resturant from '../../assets/resturant.jpeg';
import {TextComponent} from '../TextComponent';
import {createStyleSheet} from './style';

export const HomeCard = ({
  title = 'Chai stop',
  distance = '34km away',
  rating = '4.96',
  tags = ['Chai', 'Street Foods', 'Rolls'],
}) => {
  const styles = createStyleSheet();
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.imageBackground}
        source={resturant}
        resizeMode="cover"
        imageStyle={{borderRadius: 24}}>
        <AntIcon name="hearto" size={24} color="white" />
      </ImageBackground>
      <View style={styles.infoContainer}>
        <View>
          <TextComponent viewStyle={styles.title}>{title}</TextComponent>
          <TextComponent viewStyle={styles.distance}>{distance}</TextComponent>
          <TextComponent viewStyle={styles.distance}>
            {tags?.map(
              (tag, index) =>
                `${tag} ${tags?.length - 1 !== index ? ' • ' : ''}`,
            )}
          </TextComponent>
        </View>
        <View style={styles.ratingContainer}>
          <AntIcon name="star" size={12} color="black" />
          <TextComponent>{rating}</TextComponent>
        </View>
      </View>
    </View>
  );
};
