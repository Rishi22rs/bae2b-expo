import { StyleSheet } from "react-native"

export const createStyleSheet=()=>{
    return StyleSheet.create({
        container:{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height:100,
            backgroundColor:'white'
          }
    })
}