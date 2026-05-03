import {Text, View} from 'react-native';
import {createStyleSheet} from '../style';

type SmallTextProps = {
  title?: string;
  content?: string;
};

export const SmallText = ({title = '', content = ''}: SmallTextProps) => {
  const styles = createStyleSheet();
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.aboutText}>{content}</Text>
    </View>
  );
};
