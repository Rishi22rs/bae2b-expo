import {StyleProp, View, ViewProps} from 'react-native';
import {createStyleSheet} from './style';
import {ReactNode} from 'react';

interface StickyBottomViewProps {
  children: ReactNode;
  viewStyle?: StyleProp<ViewProps>;
}

export const StickyBottomView = ({
  children,
  viewStyle,
}: StickyBottomViewProps) => {
  const style = createStyleSheet();
  return <View style={[style.container, viewStyle]}>{children}</View>;
};
