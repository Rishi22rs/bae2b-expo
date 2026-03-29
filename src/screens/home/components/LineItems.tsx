import {Text, View} from 'react-native';
import {CardComponent} from '../../../components/CardComponent';
import {createStyleSheet} from '../style';

export const LineItems = ({title = '', content = []}) => {
  const styles = createStyleSheet();
  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.interestsContainer}>
        {content?.map((item, key) => (
          <View key={key} style={styles.interestPill}>
            <Text style={styles.interestText}>{item?.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
