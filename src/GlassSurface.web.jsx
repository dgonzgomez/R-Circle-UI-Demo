import React from 'react';
import {View,StyleSheet} from 'react-native';
export default function GlassSurface({children,style,frosted=false}) {
 return <View style={[styles.glass,style,frosted&&styles.frosted]}>{children}</View>;
}
const styles=StyleSheet.create({frosted:{backgroundColor:'rgba(242,251,254,0.94)',backgroundImage:'linear-gradient(135deg,rgba(255,255,255,0.6),rgba(236,250,253,0.35))',backdropFilter:'blur(34px) saturate(130%)',WebkitBackdropFilter:'blur(34px) saturate(130%)'},glass:{
 backgroundColor:'rgba(196,236,250,0.34)',
 backgroundImage:'linear-gradient(135deg, rgba(240,251,255,0.55) 0%, rgba(170,226,247,0.12) 40%, rgba(200,238,252,0.28) 100%)',
 backdropFilter:'blur(22px) saturate(175%)',
 WebkitBackdropFilter:'blur(22px) saturate(175%)',
 borderWidth:1,borderColor:'rgba(236,250,255,0.75)',
 boxShadow:'inset 0px 1px 1px rgba(255,255,255,0.95), inset 0px -1px 1px rgba(255,255,255,0.5), 0px 8px 28px rgba(25,58,75,0.09)',
 overflow:'hidden'
}});
