import React,{useEffect,useRef,useState} from 'react';
import {AccessibilityInfo,Animated,Easing,Pressable,StyleSheet,View} from 'react-native';
import GlassSurface from './GlassSurface';
export default function SearchOverlay({visible,onDismiss,children}){
 const [mounted,setMounted]=useState(visible);
 const progress=useRef(new Animated.Value(visible?1:0)).current;
 const active=useRef(visible);active.current=visible;
 const reduced=useRef(false);
 useEffect(()=>{AccessibilityInfo.isReduceMotionEnabled().then(value=>{reduced.current=value}).catch(()=>{})},[]);
 useEffect(()=>{
  if(visible)setMounted(true);
  const motion=Animated.timing(progress,{toValue:visible?1:0,duration:reduced.current?0:visible?220:150,easing:Easing.bezier(.2,.75,.25,1),useNativeDriver:true});
  motion.start(({finished})=>{if(finished&&!active.current)setMounted(false)});
  return()=>motion.stop();
 },[visible]);
 if(!mounted)return null;
 return <View style={[StyleSheet.absoluteFillObject,{zIndex:4}]} pointerEvents={visible?'auto':'none'}>
 <Animated.View style={[StyleSheet.absoluteFillObject,{opacity:progress}]}><GlassSurface style={[StyleSheet.absoluteFillObject,{backgroundColor:'#edf2e4c7',backdropFilter:'blur(28px) saturate(130%)',WebkitBackdropFilter:'blur(28px) saturate(130%)'}]}/><Pressable style={StyleSheet.absoluteFillObject} accessibilityLabel="Dismiss search" onPress={onDismiss}/></Animated.View>
 <Animated.View style={{position:'absolute',left:0,right:0,top:128,bottom:98,opacity:progress,transform:[{translateY:progress.interpolate({inputRange:[0,1],outputRange:[14,0]})}]}}>{children}</Animated.View>
 </View>;
}
