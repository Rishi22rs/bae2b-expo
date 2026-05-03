import {Text, View} from 'react-native';
import {createStyleSheet} from '../style';

type BigTextProps = {
  title?: string;
  content?: string;
};

export const BigText = ({title = '', content = ''}: BigTextProps) => {
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
