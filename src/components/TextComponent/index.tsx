import {StyleProp, Text, TextProps, TextStyle} from 'react-native';
import { createStyleSheet } from "./style"

type TextComponentProps = TextProps & {
  children: React.ReactNode;
  viewStyle?: StyleProp<TextStyle>;
};

export const TextComponent = ({children, viewStyle, ...props}: TextComponentProps) => {
    const style=createStyleSheet()
    return(
        <Text {...props} style={[style.container,viewStyle]}>{children}</Text>
    )
}
