import React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {createStyleSheet} from './style';

interface TwoColumnCardGridProps<T> {
  data: T[];
  renderCard: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string;
  emptyMessage?: string;
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const TwoColumnCardGrid = <T,>({
  data,
  renderCard,
  keyExtractor,
  emptyMessage = 'No data available',
  containerStyle,
  contentContainerStyle,
}: TwoColumnCardGridProps<T>) => {
  const styles = createStyleSheet();

  const resolveKey = (item: T, index: number) => {
    if (keyExtractor) {
      return keyExtractor(item, index);
    }

    const itemWithId = item as {id?: string | number};
    if (itemWithId?.id !== undefined && itemWithId?.id !== null) {
      return String(itemWithId.id);
    }

    return String(index);
  };

  const renderItem = ({item, index}: ListRenderItemInfo<T>) => (
    <View
      style={[
        styles.cardCell,
        index % 2 === 0 ? styles.leftCard : styles.rightCard,
      ]}>
      {renderCard(item, index)}
    </View>
  );

  return (
    <FlatList
      data={data}
      numColumns={2}
      renderItem={renderItem}
      keyExtractor={resolveKey}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={styles.row}
      style={[styles.flex, containerStyle]}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      }
    />
  );
};
