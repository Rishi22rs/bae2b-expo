import { View } from "react-native"
import { TextComponent } from "../TextComponent"
import { createStyleSheet } from "./style"

export const VendorDetailsTag=({children}:{children:React.ReactNode})=>{
    const style=createStyleSheet()
    return(
        <View style={style.tagContainer}>
            <TextComponent viewStyle={style.tagText}>{children}</TextComponent>
        </View>
    )
}