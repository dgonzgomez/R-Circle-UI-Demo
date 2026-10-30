import React from 'react';
import {View,StyleSheet} from 'react-native';
export default function GlassSurface({children,style,frosted=false}) {
 return <View style={[styles.glass,style,frosted&&styles.frosted]}>{children}</View>;
}
const styles=StyleSheet.create({frosted:{backgroundColor:'rgba(248,250,243,0.94)',backgroundImage:'linear-gradient(135deg,rgba(255,255,255,0.6),rgba(243,247,237,0.35))',backdropFilter:'blur(34px) saturate(130%)',WebkitBackdropFilter:'blur(34px) saturate(130%)'},glass:{
 backgroundColor:'rgba(255,255,255,0.28)',
 backgroundImage:'linear-gradient(135deg, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.22) 100%)',
 backdropFilter:'blur(22px) saturate(175%)',
 WebkitBackdropFilter:'blur(22px) saturate(175%)',
 borderWidth:1,borderColor:'rgba(255,255,255,0.7)',
 boxShadow:'inset 0px 1px 1px rgba(255,255,255,0.95), inset 0px -1px 1px rgba(255,255,255,0.5), 0px 8px 28px rgba(32,58,43,0.09)',
 overflow:'hidden'
}});
