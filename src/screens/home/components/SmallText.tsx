import {Text, View} from 'react-native';
import {createStyleSheet} from '../style';

export const SmallText = ({title = '', content = ''}) => {
  const styles = createStyleSheet();
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.aboutText}>{content}</Text>
    </View>
  );
};
