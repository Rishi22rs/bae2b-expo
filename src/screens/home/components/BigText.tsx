import {Text, View} from 'react-native';
import {createStyleSheet} from '../style';

export const BigText = ({title = '', content = ''}) => {
  const styles = createStyleSheet();
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title || 'Profile'}</Text>
      <View style={styles.nameRow}>
        <Text style={styles.name}>{content}</Text>
      </View>
    </View>
  );
};
