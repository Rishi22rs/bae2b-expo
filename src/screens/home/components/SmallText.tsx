import {Text, View} from 'react-native';
import {CardComponent} from '../../../components/CardComponent';
import {createStyleSheet} from '../style';

export const SmallText = ({title = '', content = ''}) => {
  const styles = createStyleSheet();
  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.aboutText}>{content}</Text>
    </View>
  );
};
