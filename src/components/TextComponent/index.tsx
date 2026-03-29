import { Text, TextStyle, ViewStyle } from "react-native"
import { createStyleSheet } from "./style"

export const TextComponent=({children,viewStyle,...props}:{children:React.ReactNode,viewStyle?:TextStyle})=>{
    const style=createStyleSheet()
    return(
        <Text {...props} style={[style.container,viewStyle]}>{children}</Text>
    )
}