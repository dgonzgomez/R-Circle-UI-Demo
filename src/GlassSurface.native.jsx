import React from 'react';
import {Platform,View,StyleSheet} from 'react-native';
import {GlassView,isLiquidGlassAvailable} from 'expo-glass-effect';
import {BlurView} from 'expo-blur';
export default function GlassSurface({children,style,frosted=false}) {
 if(Platform.OS==='ios'&&isLiquidGlassAvailable()) {
  return <GlassView glassEffectStyle="regular" tintColor="#ffffff22" style={[styles.glass,style,frosted&&{backgroundColor:'#f8faf3ef'}]}>{children}</GlassView>;
 }
 return <View style={[styles.glass,style,frosted&&{backgroundColor:'#f8faf3ef'}]}><BlurView tint="light" intensity={frosted?90:55} style={StyleSheet.absoluteFillObject}/>{children}</View>;
}
const styles=StyleSheet.create({glass:{backgroundColor:'#ffffff22',overflow:'hidden',borderWidth:1,borderColor:'#ffffffb3'}});
