import { Dimensions, StyleSheet } from "react-native"
import { hexToRgbA } from "../../utils/hexToRgba";

export const createStyleSheet=()=>{
    const dimesions=Dimensions.get("window")
    return StyleSheet.create({
      title: {
        fontSize: 16,
        fontWeight: '600',
      },
      imageBackground:{
        height:180,
        width:dimesions.width-20,
        alignItems:'flex-end',
        padding:24,
      },
      ratingContainer:{
        flexDirection:'row',
        alignItems:'center'
      },
      infoContainer:{
        justifyContent:'space-between',
        flexDirection:'row',
        marginVertical:8,
        alignItems:'flex-start'
      },
      activeTag:{
        backgroundColor:hexToRgbA("#2DD7A4",60),
        paddingVertical:6,
        justifyContent:'center',
        borderRadius:16,
        marginTop:8
      },
      activeTagStyle:{
        textAlign:'center',
        color:'white'
      },
      distance:{
        color:"#757575",
        fontSize:14,
        fontWeight:400
      }
    });
}