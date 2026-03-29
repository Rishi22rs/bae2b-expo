import {StyleProp, Text, View} from 'react-native';
import {createStyleSheet} from './style';
import {ReactNode} from 'react';
import {StyleProps} from 'react-native-reanimated';

interface CardComponentProps {
  children?: ReactNode;
  viewStyle?: StyleProp<StyleProps>;
  heading?: string;
}

export const CardComponent = ({
  children,
  viewStyle,
  heading,
}: CardComponentProps) => {
  const styles = createStyleSheet();
  return (
    <View style={[styles.container, viewStyle]}>
      {heading && <Text style={styles.cardHeading}>{heading}</Text>}
      {children}
    </View>
  );
};
