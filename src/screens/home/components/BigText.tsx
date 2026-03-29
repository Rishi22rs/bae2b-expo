import {Text, View} from 'react-native';
import {CardComponent} from '../../../components/CardComponent';
import {createStyleSheet} from '../style';

export const BigText = ({title = '', content = ''}) => {
  const styles = createStyleSheet();
  return (
    <View style={styles.nameRow}>
      <Text style={styles.name}>{content}</Text>
    </View>
  );
};
