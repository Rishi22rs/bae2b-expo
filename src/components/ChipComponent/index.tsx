import {
  Pressable,
  PressableProps,
  StyleProp,
  Text,
  TextStyle,
} from 'react-native';
import {createStyleSheet} from './style';

interface ChipProps {
  chipStyle?: StyleProp<PressableProps>;
  selected?: boolean;
  onSelect?: (label: string) => void;
  labelStyle?: StyleProp<TextStyle>;
  label: string;
}

export const Chip = ({
  chipStyle,
  selected,
  onSelect,
  labelStyle,
  label,
}: ChipProps) => {
  const styles = createStyleSheet();
  return (
    <Pressable
      style={[styles.defaultStyle, chipStyle, selected && styles.selectedChip]}
      onPress={() => onSelect?.(label)}>
      <Text style={[styles.defaultLabel, labelStyle]}>{label}</Text>
    </Pressable>
  );
};
