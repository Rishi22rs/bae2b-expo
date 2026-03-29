import { StyleSheet } from "react-native"
import { hexToRgbA } from "../../utils/hexToRgba"

export const createStyleSheet=()=>{
    return StyleSheet.create({
        tagText:{
            color:'#B8B8B8',
        },
        tagContainer:{
            backgroundColor:hexToRgbA("#176FF2",5),
            paddingVertical:8,
            paddingHorizontal:20,
            borderRadius:8,
            margin:4
        }
    })
}