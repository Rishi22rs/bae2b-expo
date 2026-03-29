import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {createStyleSheet} from './style';
import SearchIcon from 'react-native-vector-icons/EvilIcons';
import {TextComponent} from '../TextComponent';

interface TextInputComponentProps extends TextInputProps {
  viewStyle?: StyleProp<ViewStyle>;
  inputStyle?: TextStyle;
  iconName?: string;
  showIcon?: boolean;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  numOfLines?: number;
  isError?: boolean;
}

export const TextInputComponent = ({
  viewStyle,
  inputStyle,
  iconName,
  showIcon = false,
  label,
  labelStyle,
  numOfLines = 1,
  isError = false,
  ...props
}: TextInputComponentProps) => {
  const style = createStyleSheet();
  return (
    // <TextInput {...props} style={[style.container,viewStyle]}/>
    <>
      {label && (
        <TextComponent viewStyle={[labelStyle, isError && {color: '#f74a6e'}]}>
          {label}
        </TextComponent>
      )}
      <View style={[style.container, viewStyle]}>
        {showIcon && (
          <SearchIcon name={'search'} size={30} style={style.iconStyle} />
        )}

        <TextInput
          {...props}
          style={[
            style.textInput,
            inputStyle,
            isError && {
              borderWidth: 1.5,
              borderColor: '#f74a6e',
              borderRadius: 10,
              paddingVertical: 12,
              paddingHorizontal: 14,
              fontSize: 15,
              color: '#000',
            },
          ]}
          multiline={true}
          numberOfLines={numOfLines}
        />
      </View>
    </>
  );
};
