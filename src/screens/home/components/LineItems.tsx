import {Text, View} from 'react-native';
import {createStyleSheet} from '../style';

type LineItem = string | {value?: string};

type LineItemsProps = {
  title?: string;
  content?: LineItem[];
};

export const LineItems = ({title = '', content = []}: LineItemsProps) => {
  const styles = createStyleSheet();

  const resolveItemLabel = (item: unknown) => {
    if (typeof item === 'string') {
      return item;
    }

    if (item && typeof item === 'object' && 'value' in item) {
      return (item as {value?: string})?.value || '';
    }

    return '';
  };

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.interestsContainer}>
        {content?.map((item, key) => {
          const label = resolveItemLabel(item);
          if (!label) {
            return null;
          }

          return (
            <View key={key} style={styles.interestPill}>
              <Text style={styles.interestText}>{label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};
